import { playNote } from './midi.js';
import vm from 'node:vm';
import {clearScheduledEvents, schedule} from './scheduler.js';

export function runInSandbox(userCode, midiOutput, textOutputLines) {
  clearScheduledEvents();

  const context = {
    note(pitch, velocity, duration, channel) {
      playNote(midiOutput, channel, pitch, velocity, duration);
    },
    log(msg) {
      textOutputLines.push(msg);
    },
    at(time, action) {
      schedule(time, action);
    },
  };

  try {
    vm.runInNewContext(userCode, context, { timeout: 10000 });
  } catch (e) {
    textOutputLines.push(e);
  }
}
