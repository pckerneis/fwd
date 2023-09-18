import * as fs from 'node:fs/promises';
import * as path from 'path';
import process from 'process';

import { rli } from './rli.js';
import { getBestMatches, promptMidiOutputName } from './prompt.js';
import { getOutputs, openMidiOutput } from './midi.js';
import { runInSandbox } from './vm.js';

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

  const startDate = Date.now();
  const outlines = [];
  const midiOutput = openMidiOutput(existingOutput);

  setInterval(() => {
    clearBuffer();

    console.log(
      `Output: ${existingOutput}
File:   ${existingFile.path}
Time:   ${(Date.now() - startDate) / 1000}

(s) to start/stop
(p) to pause/unpause
____________________________________
${outlines.join('\n')}`,
    );
  }, 100);

  runInSandbox(existingFile.content, midiOutput, outlines);

  const ac = new AbortController();
  const { signal } = ac;
  setTimeout(() => ac.abort(), 10000);

  try {
    const watcher = fs.watch(existingFile.path, { signal });
    for await (const event of watcher) {
      runInSandbox(existingFile.content, midiOutput, outlines);
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      return;
    }

    throw err;
  }
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
