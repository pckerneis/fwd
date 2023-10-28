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
import { define, undefine } from './api/api.env.js';
import { iter, pick } from './api/api.utils.js';
import { getNoteNumberConstants } from './api/api.notes.js';
import { getPattern } from 'euclidean-rhythms';
import { resetScopes } from './api/api.scope.js';
import { random, setSeed } from './api/api.random.js';
import { stepper } from './api/api.stepper.js';
import { smooth } from './api/api.smooth.js';
import { ring } from './api/api.ring.js';

function getApi() {
  return {
    cursor,
    now,
    at,
    fire,
    repeat,
    wait,
    next,

    setSpeed,
    getSpeed,
    speed,

    note,
    cc,
    program,
    channel,
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
    undefine,
    undef: undefine,

    pick,
    iter,

    setSeed,
    random,

    ring,

    stepper,

    ...getNoteNumberConstants(),

    euclid: getPattern,

    smooth,
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
