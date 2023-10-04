import {
  at,
  cursor,
  fire,
  now,
  repeat,
  resetCursor,
  wait,
} from './api/api.scheduler.js';
import { _env, setEnv, setLogLines, setMidiOutput } from './api/api.shared.js';
import { cc, channel, note, program } from './api/api.midi.js';
import { clear, fclear, flog, log } from './api/api.log.js';
import { define, set } from './api/api.env.js';
import { iter, pick } from './api/api.utils.js';

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
  resetCursor();
  setMidiOutput(midiOutput);
  setLogLines(textOutputLines);

  setEnv({
    ..._env,
    ...getApi(),
  });

  return _env;
}
