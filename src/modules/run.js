import * as fs from 'node:fs/promises';
import * as path from 'path';
import process from 'process';

import { rli, clearBuffer } from './rli.js';
import { getBestMatches, promptMidiOutputName } from './prompt.js';
import { getOutputs } from './midi.js';

export async function run(file, output, bpm) {
  const existingFile = await promptAndReadFile(file);

  const outputs = getOutputs();
  let existingOutput;

  const bestMatches = output != null ? getBestMatches(output, outputs) : [];

  if (bestMatches.length === 1) {
    existingOutput = bestMatches[0];
  } else {
    existingOutput = await promptMidiOutputName(outputs);
  }

  const existingBPM = (bpm && parseFloat(bpm)) || 120;

  let t = 0;

  setInterval(() => {
    clearBuffer();

    console.log(
      `Output: ${existingOutput}
File:   ${existingFile.path}
BPM:    ${existingBPM}
Time:   ${t}

(s) to start/stop
(p) to pause/unpause
____________________________________`,
    );
    t += 1;
  }, 100);
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
