import vm from 'node:vm';
import { incrementSchedulerId } from './scheduler.js';
import { dbg } from './dbg.js';
import { getApiContext } from './api.js';

let lastChangeDate;

/**
 * @returns {Date} the date at which the program was last executed
 */
export function getLastChangeDate() {
  return lastChangeDate;
}

/**
 * Runs user code in a sandbox virtual machine
 * @param {string} userCode the JS code to run
 * @param {object} midiOutput MIDI output object to use
 * @param {string[]} textOutputLines array of messages to log
 */
export function runInSandbox(userCode, midiOutput, textOutputLines) {
  incrementSchedulerId();

  const context = vm.createContext(getApiContext(midiOutput, textOutputLines));

  dbg(`Starting execution of code with length ${userCode.length}`);

  try {
    vm.runInContext(userCode, context, { timeout: 10000 });
    lastChangeDate = new Date();
    dbg(`Finished execution (${lastChangeDate.toLocaleTimeString()})`);
  } catch (e) {
    textOutputLines.push(e);
  }
}
