import { playNote } from './midi.js';

export function runInSandbox(userCode, midiOutput, textOutputLines) {
  try {
    eval(`"use strict";

    function log(msg) {
      textOutputLines.push(msg);
    }

    function note(pitch, velocity, time, duration, channel) {
      playNote(midiOutput, channel, pitch, velocity, time, duration);
    }

    ${userCode}`);
  } catch (e) {
    textOutputLines.push(e);
  }
}
