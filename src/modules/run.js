import * as fs from 'node:fs/promises';
import * as path from 'path';
import process from 'process';

import { rli, clearBuffer } from './rli.js';
import { getBestMatches, promptMidiOutputName } from './prompt.js';
import { getOutputs, openMidiOutput } from './midi.js';
import { runInSandbox } from './vm.js';
import { watchFile } from './watch-file.js';
import {now, startScheduler} from './scheduler.js';

function startDisplay(existingOutput, existingFile, outlines) {
  setInterval(() => {
    clearBuffer();

    const maxLines = 5;
    if (outlines.length > maxLines) {
      outlines.splice(0, outlines.length - maxLines);
    }

    console.log(
        `Output: ${existingOutput}
File:   ${existingFile.path}
Time:   ${now()}
____________________________________
${outlines.join('\n')}`,
    );
  }, 100);
}

export async function run(file, output) {
  const existingFile = await promptAndReadFile(file);

  const outputs = getOutputs();
  let existingOutput;

  const bestMatches = output != null ? getBestMatches(output, outputs) : [];

  if (bestMatches.length === 1) {
    existingOutput = bestMatches[0];
  } else {
    existingOutput = await promptMidiOutputName(outputs);
  }

  const outlines = [];
  const midiOutput = openMidiOutput(existingOutput);

  startDisplay(existingOutput, existingFile, outlines);

  runInSandbox(existingFile.content, midiOutput, outlines);

  startScheduler();

  watchFile(existingFile.path, async () => {
    const updatedFile = await tryToReadFile(existingFile.path);
    runInSandbox(updatedFile.content, midiOutput, outlines);
  });
}

export async function promptAndReadFile(filePath) {
  const existingFile = await tryToReadFile(filePath);

  if (existingFile != null) {
    return existingFile;
  } else {
    return await promptFile();
  }
}

async function promptFile() {
  const answer = await rli.question(`What file to run? `);
  const existingFile = await tryToReadFile(answer);

  if (existingFile) {
    console.info(`\nReading from "${existingFile.path}".\n`);

    return existingFile;
  } else {
    console.warn(`\nCannot read "${answer}".\n`);

    return await promptFile();
  }
}

async function tryToReadFile(relativeOrAbsolutePath) {
  if (!relativeOrAbsolutePath) {
    return null;
  }

  try {
    return {
      path: relativeOrAbsolutePath,
      content: await fs.readFile(relativeOrAbsolutePath, 'utf8'),
    };
  } catch (e) {
    try {
      const fullPath = path.resolve(process.cwd(), relativeOrAbsolutePath);
      return {
        path: fullPath,
        content: await fs.readFile(fullPath, 'utf8'),
      };
    } catch (e2) {
      return null;
    }
  }
}
