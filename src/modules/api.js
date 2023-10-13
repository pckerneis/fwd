import {
  at,
  cursor,
  fire,
  getSpeed,
  loop,
  next,
  now,
  repeat,
  setSpeed,
  speed,
  wait,
} from './api/api.scheduler.js';
import { _env, setEnv, setLogLines, setMidiOutput } from './api/api.shared.js';
import { cc, channel, note, program } from './api/api.midi.js';
import { clear, fclear, flog, log } from './api/api.log.js';
import { define, set } from './api/api.env.js';
import { iter, pick, ring } from './api/api.utils.js';
import { getNoteNumberConstants } from './api/api.notes.js';
import { getPattern } from 'euclidean-rhythms';
import { resetScopes } from './api/api.scope.js';

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
    loop,
    _l: loop,
    wait,
    _w: wait,
    next,

    note,
    _n: note,
    cc,
    _cc: cc,
    program,
    _pc: program,
    channel,
    _c: channel,

    clear,
    cls: clear,
    fclear,
    fcls: fclear,
    log,
    flog,

    pick,
    _p: pick,
    iter,

    define,
    def: define,
    set,

    setSpeed,
    getSpeed,
    speed,

    ring,

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

  setEnv({
    ..._env,
    ...getApi(),
  });

  return _env;
}
