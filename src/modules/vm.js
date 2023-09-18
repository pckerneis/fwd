import { playNote } from './midi.js';
import vm from 'node:vm';

export function runInSandbox(userCode, midiOutput, textOutputLines) {
  const context = {
    note(pitch, velocity, time, duration, channel) {
      playNote(midiOutput, channel, pitch, velocity, time, duration);
    },
    log(msg) {
      textOutputLines.push(msg);
    },
  };

  try {
    vm.runInNewContext(userCode, context);
  } catch (e) {
    textOutputLines.push(e);
  }
}
