import { now, schedule } from './scheduler.js';
import { playNote } from './midi.js';

let _midiOutput;
let _textOutputLines;
let _env;
let _cursor = 0;

export function initApi(midiOutput, textOutputLines, env) {
  _midiOutput = midiOutput;
  _textOutputLines = textOutputLines;
  _env = env;
  _cursor = 0;
}

function fire(action) {
  schedule(_cursor, action);
}

function log(msg) {
  _textOutputLines.push(msg);
}

function note(pitch, velocity, duration, channel) {
  fire(() => playNote(_midiOutput, channel, pitch, velocity, duration));
}

function flog(msg) {
  fire(() => log(msg));
}

function at(time) {
  _cursor = time;
}

function wait(duration) {
  _cursor += duration;
}

function cursor() {
  return _cursor;
}

export function getApi() {
  return {
    env: _env,
    fire,
    log,
    now,
    note,
    flog,
    at,
    wait,
    cursor,
  };
}
