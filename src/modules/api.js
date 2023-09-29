import {
  getCurrentSchedulerId,
  getCurrentEventTime,
  schedule,
} from './scheduler.js';
import { playNote, sendProgramChange } from './midi.js';
import { dbg } from './dbg.js';

let _midiOutput;
let _textOutputLines;
let _cursor = 0;
let defaultMidiChannel = 0;
let _env;

/**
 * Returns the execution time
 * @returns {number} Current execution time
 */
function now() {
  return getCurrentEventTime();
}

/**
 * Returns the current time cursor position
 * @returns {number} the cursor position
 */
function cursor() {
  return _cursor;
}

/**
 * Schedule the function `action` to be called at the cursor position.
 *
 * @param {Function} action - The action to schedule as a function
 */
function fire(action) {
  const memoizedCursor = _cursor;

  if (_cursor >= now()) {
    schedule(_cursor, () => {
      const timeOutside = _cursor;
      _cursor = memoizedCursor;
      action();
      _cursor = timeOutside;
    });
  }
}

/**
 * Repeatedly calls the function `action` every `interval` seconds `count` times, starting at the cursor position.
 *
 * @param {Function} action - The action to repeat
 * @param {number} interval - The repeat interval
 * @param {number} count - How many times to repeat
 */
function repeat(action, interval, count = Infinity) {
  let stepCount = 0;
  let nextCursor = _cursor;
  const schedulerId = getCurrentSchedulerId();

  const t = now();

  for (;;) {
    if (nextCursor >= t) {
      break;
    }

    count -= 1;
    stepCount++;

    if (count < 0) {
      return;
    }

    nextCursor += interval;
  }

  const scheduleNext = () => {
    schedule(nextCursor, () => {
      if (schedulerId === getCurrentSchedulerId() && count > 0) {
        const timeOutside = _cursor;
        _cursor = nextCursor;

        action(stepCount++);
        _cursor = timeOutside;

        count -= 1;
        nextCursor += interval;
        scheduleNext();
      }
    });
  };

  scheduleNext();
}

/**
 * Move the cursor at position `time` expressed in seconds.
 *
 * @param {number} time - Time position in seconds
 */
function at(time) {
  _cursor = time;
}

/**
 * Offset the cursor by `duration` expressed in seconds.
 *
 * @param {number} duration - Duration in seconds
 */
function wait(duration) {
  _cursor += duration;
}

/**
 * Schedule a MIDI note to be played at the cursor position
 * with note number `pitch`, velocity `velocity` and duration `duration` on MIDI channel `channel`.
 *
 * @param {number} pitch - MIDI note number
 * @param {number} velocity - Velocity value
 * @param {number} duration - Note duration
 * @param {number} [channel] - MIDI channel to send to
 */
function note(pitch, velocity, duration, channel) {
  channel = channel ?? defaultMidiChannel;

  fire(() => {
    dbg('About to play note');
    playNote(_midiOutput, channel, pitch, velocity, duration);
  });
}

/**
 * Sends a MIDI program change message.
 * @param {number} program - MIDI program number
 * @param {number} [channel] - MIDI channel to send to
 */
function program(program, channel) {
  channel = channel ?? defaultMidiChannel;

  fire(() => sendProgramChange(_midiOutput, program, channel));
}

/**
 * Set the default value for next MIDI messages
 * @param {number} [channelNumber] - Default MIDI channel
 */
export function channel(channelNumber) {
  defaultMidiChannel = channelNumber ?? 0;
}

/**
 * Pick an element among choices.
 * - If an array is provided, the output will be an element of the array
 * - If an string is provided, the output will be a character of the string
 * - If a number is provided, the output will be a number between 0 and this number
 * - For other inputs, the output is a random value between 0 and 1
 *
 * @param {Array} [numberOrArrayOrElements] - choices to pick from as a number, an array or a string
 * @returns {*} a randomly picked element
 */
function pick(...numberOrArrayOrElements) {
  const value = Math.random();

  if (numberOrArrayOrElements?.length === 0) {
    return value;
  } else if (numberOrArrayOrElements?.length > 1) {
    const index = Math.floor(value * numberOrArrayOrElements.length);
    return numberOrArrayOrElements[index];
  } else {
    const numberOrArray = numberOrArrayOrElements[0];
    if (Array.isArray(numberOrArray) || typeof numberOrArray === 'string') {
      return numberOrArray[Math.floor(value * numberOrArray.length)];
    } else if (typeof numberOrArray === 'number') {
      return value * numberOrArray;
    } else {
      return value;
    }
  }
}

/**
 * Clears the logs.
 */
function clear() {
  _textOutputLines.splice(0, _textOutputLines.length);
}

/**
 * Schedule a log clear at the cursor position.
 */
function fclear() {
  fire(() => clear());
}

/**
 * Log messages tout console output.
 *
 * @param {*} messages - Messages to log
 */
function log(...messages) {
  _textOutputLines.push(...messages);
}

/**
 * Schedule messages to be logged at the cursor position.
 *
 * @param {*} messages - Messages to log
 */
function flog(...messages) {
  fire(() => log(...messages));
}

/**
 * Define variable in the execution context with an optional default value.
 * This won't have any effects if a value is already defined for `name`.
 * @param {string} name - The accessor name
 * @param {*} [defaultValue] - A default value
 * @return {*} the named value
 */
function define(name, defaultValue) {
  if (Object.prototype.hasOwnProperty.call(_env, name)) {
    _env[name] = defaultValue;
  }

  return _env[name];
}

/**
 * Alias for define.
 * @see define(name, defaultValue)
 */
function def(name, value) {
  return define(name, value);
}

/**
 * Undefine variable in the execution context with an optional default value.
 * @param {string} name - The accessor name
 */
function forget(name) {
  delete _env[name];
}

/**
 * Alias for forget.
 * @see forget(name)
 */
function ndef(name) {
  forget(name);
}

/**
 * Define or overwrite variable in the execution context with the provided value.
 * This won't have any effects if a value is already defined for `name`.
 * @param {string} name - The accessor name
 * @param {*} value - new value
 */
function set(name, value) {
  _env[name] = value;
}

function getApi() {
  return {
    fire,
    log,
    now,
    note,
    flog,
    at,
    wait,
    cursor,
    repeat,
    program,
    channel,
    clear,
    fclear,
    pick,

    define,
    forget,
    def,
    ndef,
    set,
  };
}

/**
 * Initialise and return API context
 * @param {object} midiOutput - MIDI output used
 * @param {Array} textOutputLines - Array of messages to log
 * @return the API context
 */
export function getApiContext(midiOutput, textOutputLines) {
  _midiOutput = midiOutput;
  _textOutputLines = textOutputLines;
  _cursor = 0;
  _env = {
    ..._env,
    ...getApi(),
  };
  return _env;
}
