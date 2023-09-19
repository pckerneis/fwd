import { playNote } from './midi.js';
import vm from 'node:vm';
import {clearScheduledEvents, now, schedule} from './scheduler.js';

let lastChangeDate;

export function getLastChangeDate() {
  return lastChangeDate;
}

function buildContext(midiOutput, textOutputLines) {
  let cursor = 0;

  const fire = (action) => schedule(cursor, action);

  const log = (msg) => textOutputLines.push(msg);

  return {
    fire,
    log,
    note(pitch, velocity, duration, channel) {
      fire(() => playNote(midiOutput, channel, pitch, velocity, duration));
    },
    flog(msg) {
      fire(() => log(msg));
    },
    at(time) {
      cursor = time;
    },
    wait(duration) {
      cursor += duration;
    },
    now() {
      return now();
    },
    cursor() {
      return cursor;
    }
  };
}

export function runInSandbox(userCode, midiOutput, textOutputLines) {
  clearScheduledEvents();

  const context = buildContext(midiOutput, textOutputLines);

  try {
    vm.runInNewContext(userCode, context, { timeout: 10000 });
    lastChangeDate = new Date();
  } catch (e) {
    textOutputLines.push(e);
  }
}
