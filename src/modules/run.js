import chokidar from 'chokidar';

import {
  getBestMatches,
  promptAndReadFile,
  promptMidiOutputName,
} from './prompt.js';
import { getOutputs, openMidiOutput } from './midi.js';
import { runInSandbox } from './vm.js';
import { initScheduler, startScheduler } from './scheduler.js';
import { startDisplay } from './display.js';
import { tryToReadFile } from './file.js';

/**
 * Runs the CLI
 * @param {string} file An optional path to file
 * @param {string} output An optional MIDI output name
 */
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

  const env = {};
  const outlines = [];
  const midiOutput = openMidiOutput(existingOutput);

  startDisplay(existingOutput, existingFile.path, outlines);

  initScheduler();

  runInSandbox(existingFile.content, midiOutput, outlines, env);

  startScheduler();

  chokidar.watch(existingFile.path).on('change', async () => {
    const updatedFile = await tryToReadFile(existingFile.path);
    runInSandbox(updatedFile.content, midiOutput, outlines, env);
  });
}
