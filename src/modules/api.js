import { getPreviousTime, now, schedule } from './scheduler.js';
import { playNote, sendProgramChange, setDefaultMidiChannel } from './midi.js';

let _midiOutput;
let _textOutputLines;
let _cursor = 0;

/**
 * Initialise API context
 * @param {object} midiOutput MIDI output used
 * @param {Array} textOutputLines array of messages to log
 */
export function initApi(midiOutput, textOutputLines) {
  _midiOutput = midiOutput;
  _textOutputLines = textOutputLines;
  _cursor = 0;
}

/**
 * Schedule the function `action` to be called at the cursor position.
 *
 * @param {Function} action the action to schedule
 */
function fire(action) {
  const memoizedCursor = _cursor;

  if (_cursor >= getPreviousTime()) {
    schedule(_cursor, () => {
      const timeOutside = _cursor;
      _cursor = memoizedCursor;
      action();
      _cursor = timeOutside;
    });
  }
}

/**
 * Repeatedly calls the function `fn` every `interval` seconds for `count` times, starting at the cursor position.
 *
 * @param {Function} action the action to repeat
 * @param {number} interval the repeat interval
 * @param {number} count how many times to repeat
 * @returns
 */
function repeat(action, interval, count = Infinity) {
  let stepCount = 0;
  let nextCursor = _cursor;

  const t = now();

  for (;;) {
    if (nextCursor + interval >= t) {
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
      if (count > 0) {
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
 * Log a message.
 *
 * @param {*} message
 */
function log(message) {
  _textOutputLines.push(message);
}

/**
 * Schedule a message to be logged at the cursor position.
 *
 * @param {*} message
 */
function flog(message) {
  fire(() => log(message));
}

/**
 * Move the cursor at position `time` expressed in seconds.
 *
 * @param {number} time
 */
function at(time) {
  _cursor = time;
}

/**
 * Offset the cursor by `duration` expressed in seconds.
 *
 * @param {number} duration
 */
function wait(duration) {
  _cursor += duration;
}

/**
 * @returns the cursor position.
 */
function cursor() {
  return _cursor;
}

/**
 * Schedule a MIDI note to be played at the cursor position
 * with note number `pitch`, velocity `velocity` and duration `duration` on midi channel `channel`.
 *
 * @param {number} pitch
 * @param {number} velocity
 * @param {number} duration
 * @param {number} channel
 */
function note(pitch, velocity, duration, channel) {
  fire(() => playNote(_midiOutput, channel, pitch, velocity, duration));
}

function program(program, channel) {
  fire(() => sendProgramChange(_midiOutput, program, channel));
}

function channel(channel) {
  fire(() => setDefaultMidiChannel(channel));
}

function pick(numberOrArray) {
  const value = Math.random();

  if (Array.isArray(numberOrArray) || typeof numberOrArray === 'string') {
    return numberOrArray[Math.floor(value * numberOrArray.length)];
  } else if (typeof numberOrArray === 'number') {
    return value * numberOrArray;
  } else {
    return value;
  }
}

/**
 * @returns the public API
 */
export function getApi() {
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
  };
}
