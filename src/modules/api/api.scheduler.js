import {
  getCurrentEventTime,
  getCurrentSchedulerId,
  getSchedulerSpeed,
  schedule,
  setSchedulerSpeed,
} from '../cli/scheduler.js';
import { channel, getDefaultMidiChannel } from './api.midi.js';

let _cursor;

const loops = {};
const activeLoops = {};

/**
 * Returns the execution time
 * @returns {number} Current execution time
 */
export function now() {
  return getCurrentEventTime();
}

/**
 * Returns the current time cursor position
 * @returns {number} the cursor position
 */
export function cursor() {
  return _cursor;
}

/**
 * Reset the cursor to 0
 */
export function resetCursor() {
  _cursor = 0;
}

/**
 * Schedule the function `action` to be called at the cursor position.
 *
 * @param {Function} action - The action to schedule as a function
 */
export function fire(action) {
  const memoizedCursor = _cursor;
  const memoizedChannel = getDefaultMidiChannel();

  if (_cursor >= now()) {
    schedule(_cursor, () => {
      callScoped(memoizedCursor, memoizedChannel, action);
    });
  }
}

/**
 * Repeatedly calls the function `action` every `interval` seconds `count` times, starting at the cursor position.
 *
 * @param {number} interval - The repeat interval as a strictly positive number of seconds
 * @param {Function} action - The action to repeat
 * @param {number} count - How many times to repeat. Defaults to Infinity.
 */
export function repeat(interval, action, count = Infinity) {
  if (typeof interval !== 'number' || Number.isNaN(interval) || interval <= 0) {
    return;
  }

  const memoizedChannel = getDefaultMidiChannel();
  const schedulerId = getCurrentSchedulerId();
  const t = now();
  let stepCount = 0;
  let nextCursor = _cursor;

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
        callScoped(nextCursor, memoizedChannel, () => action(stepCount++));
        count -= 1;
        nextCursor += interval;
        scheduleNext();
      }
    });
  };

  scheduleNext();
}

function callScoped(cursor, midiChannel, action) {
  const channelOutside = getDefaultMidiChannel();
  channel(midiChannel);

  const timeOutside = _cursor;
  _cursor = cursor;

  action();

  _cursor = timeOutside;
  channel(channelOutside);
}

/**
 * Define a named loop or replace an existing one. The function `action` will be
 * called repeatedly if the cursor moves by a positive amount.
 *
 * @param {string} name - The loop's name
 * @param {function} action - The action to repeat
 */
export function loop(name, action) {
  if (typeof name !== 'string' || typeof action !== 'function') {
    return;
  }

  activeLoops[name] = true;

  if (loops[name] == null) {
    loops[name] = action;

    let memoizedCursor = _cursor;

    const doItOnce = () => {
      if (loops[name] != null) {
        if (!activeLoops[name]) {
          loops[name] = null;
          return;
        }

        const timeOutside = _cursor;
        _cursor = memoizedCursor;
        loops[name]();

        if (_cursor > memoizedCursor) {
          schedule(_cursor, () => {
            doItOnce();
          });
        }
        memoizedCursor = _cursor;
        _cursor = timeOutside;
      }
    };

    doItOnce();
  } else {
    loops[name] = action;
  }
}

/**
 * Mark all loops as inactive. Inactive loops won't repeat until reactivated.
 */
export function deactivatePendingLoops() {
  for (let name of Object.keys(loops)) {
    activeLoops[name] = false;
  }
}

/**
 * Move the cursor at position `time` expressed in seconds.
 *
 * @param {number} time - Time position in seconds
 */
export function at(time) {
  _cursor = time;
}

/**
 * Offset the cursor by `duration` expressed in seconds.
 *
 * @param {number} duration - Duration in seconds
 */
export function wait(duration) {
  _cursor += duration;
}

/**
 * Sets the scheduler's playback speed. Defaults to 1.
 * `newSpeed` must be a strictly positive number, or the function call won't have
 * any effect.
 * If speed is set to 2, time will tick twice as fast. This is useful for defining
 * a global tempo value.
 *
 * @param {number} newSpeed - The new speed value
 */
export function setSpeed(newSpeed) {
  setSchedulerSpeed(newSpeed);
}

/**
 * Returns the current scheduler's playback speed.
 * @return {number}
 */
export function getSpeed() {
  return getSchedulerSpeed();
}

/**
 * Shortcut for setting and getting scheduler's playback speed.
 * @param {number} [newSpeed] - New speed value. If you pass null, undefined or omit
 * the value, the scheduler's speed won't change.
 * @return {number} Scheduler playback speed after eventual modification
 */
export function speed(newSpeed) {
  if (newSpeed !== undefined) {
    setSpeed(newSpeed);
  }

  return getSpeed();
}
