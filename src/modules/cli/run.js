import chokidar from 'chokidar';
import {
  getBestMatches,
  promptAndReadFile,
  promptMidiOutputName,
} from './prompt.js';
import { runInSandbox } from './vm.js';
import {
  initScheduler,
  startScheduler,
  toggleSchedulerPaused,
} from './scheduler.js';
import { startDisplay } from './display.js';
import { tryToReadFile } from './file.js';
import { dbg, DBG_MODE } from './dbg.js';
import easymidi from 'easymidi';
import readline from 'readline';

/**
 * Get an existing MIDI output name
 * @param {string} output - An optional MIDI output name
 * @returns {Promise<null|string|*>} the MIDI output or null
 */
async function getExistingMidiOutput(output) {
  const outputs = easymidi.getOutputs();

  const bestMatches = output != null ? getBestMatches(output, outputs) : [];

  if (bestMatches.length === 1) {
    return bestMatches[0];
  } else {
    return await promptMidiOutputName(outputs);
  }
}

/**
 * Start watching a file for changes and run it in the sandbox when it changes
 * @param existingFile
 * @param midiOutput
 * @param outlines
 */
function startWatching(existingFile, midiOutput, outlines) {
  chokidar
    .watch(existingFile.path, {
      awaitWriteFinish: {
        stabilityThreshold: 500,
      },
    })
    .on('change', async () => {
      const updatedFile = await tryToReadFile(existingFile.path);
      dbg(
        `read file ${updatedFile.path}. Length is ${updatedFile.content.length}`,
      );
      runInSandbox(updatedFile.content, midiOutput, outlines);
    });
}

/**
 * Add key bindings to the CLI
 */
function addKeyBindings() {
  readline.emitKeypressEvents(process.stdin);

  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  process.stdin.on('keypress', (chunk, key) => {
    dbg(`Received key input "${key.name}".'`);
    if (key) {
      if (key.name === 'escape') {
        console.log('Goodbye!');
        process.exit();
      }

      if (key.name === 'space') {
        toggleSchedulerPaused();
      }
    }
  });
}

/**
 * Runs the CLI
 * @param {string} file An optional path to file
 * @param {string} output An optional MIDI output name
 * @param {boolean} headless - If true, header is hidden
 * @param {boolean} watch - If true, program file changes will trigger an execution
 */
export async function run(file, output, headless, watch) {
  const existingFile = await promptAndReadFile(file);
  const outlines = [];
  const existingOutput = await getExistingMidiOutput(output);
  const midiOutput = new easymidi.Output(existingOutput);

  if (!DBG_MODE) {
    startDisplay(existingOutput, existingFile.path, outlines, headless);
  }

  initScheduler();
  runInSandbox(existingFile.content, midiOutput, outlines);
  startScheduler(outlines);

  if (watch) {
    startWatching(existingFile, midiOutput, outlines);
  }

  addKeyBindings();
}
