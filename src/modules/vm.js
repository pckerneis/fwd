import vm from 'node:vm';
import { clearScheduledEvents } from './scheduler.js';
import { getApi, initApi } from './api.js';
import { dbg } from './dbg.js';

let lastChangeDate;

/**
 * @returns {Date} the date at which the program was last executed
 */
export function getLastChangeDate() {
  return lastChangeDate;
}

/**
 * Build VM context
 * @param {object} midiOutput MIDI output object to use
 * @param {string[]} textOutputLines array of messages to log
 * @param {object} env Environment dictionary persisted between executions
 * @returns the VM context
 */
function buildContext(midiOutput, textOutputLines, env) {
  initApi(midiOutput, textOutputLines);

  return {
    env,
    ...getApi(),
  };
}

/**
 * Runs user code in a sandbox virtual machine
 * @param {string} userCode the JS code to run
 * @param {object} midiOutput MIDI output object to use
 * @param {string[]} textOutputLines array of messages to log
 * @param {object} env Environment dictionary persisted between executions
 */
export function runInSandbox(userCode, midiOutput, textOutputLines, env) {
  clearScheduledEvents();

  const context = buildContext(midiOutput, textOutputLines, env);

  dbg(`Starting execution of code with length ${userCode.length}`);

  try {
    vm.runInNewContext(userCode, context, { timeout: 10000 });
    lastChangeDate = new Date();
    dbg(`Finished execution (${lastChangeDate.toLocaleTimeString()})`);
  } catch (e) {
    textOutputLines.push(e);
  }
}
