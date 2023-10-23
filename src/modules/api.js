import {
  at,
  cursor,
  fire,
  getSpeed,
  next,
  now,
  repeat,
  setSpeed,
  speed,
  wait,
} from './api/api.scheduler.js';
import { setLogLines, setMidiOutput } from './api/api.shared.js';
import {
  cc,
  channel,
  mute,
  note,
  program,
  solo,
  unmute,
  unsolo,
} from './api/api.midi.js';
import { clear, fclear, flog, log } from './api/api.log.js';
import { define } from './api/api.env.js';
import { iter, pick, ring } from './api/api.utils.js';
import { getNoteNumberConstants } from './api/api.notes.js';
import { getPattern } from 'euclidean-rhythms';
import { resetScopes } from './api/api.scope.js';
import { random, setSeed } from './api/api.random.js';
import { stepper } from './api/api.stepper.js';

function getApi() {
  return {
    cursor,
    now,
    at,
    _a: at,
    fire,
    _f: fire,
    repeat,
    _r: repeat,
    wait,
    _w: wait,
    next,

    setSpeed,
    getSpeed,
    speed,

    note,
    _n: note,
    cc,
    _cc: cc,
    program,
    _pc: program,
    channel,
    _c: channel,
    mute,
    unmute,
    solo,
    unsolo,

    clear,
    cls: clear,
    fclear,
    fcls: fclear,
    log,
    flog,

    define,
    def: define,

    pick,
    _p: pick,
    iter,
    ring,
    setSeed,
    random,

    stepper,

    ...getNoteNumberConstants(),

    euclid: getPattern,
  };
}

/**
 * Initialise and return API context
 * @param {object} midiOutput - MIDI output used
 * @param {Array} textOutputLines - Array of messages to log
 * @return the API context
 * @ignore
 */
export function getApiContext(midiOutput, textOutputLines) {
  resetScopes();
  setMidiOutput(midiOutput);
  setLogLines(textOutputLines);
  return getApi();
}
