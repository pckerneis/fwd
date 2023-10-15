import {
  getCurrentEventTime,
  getCurrentSchedulerId,
  getSchedulerSpeed,
  schedule,
  setSchedulerSpeed,
} from '../cli/scheduler.js';
import { getDefaultMidiChannel } from './api.midi.js';
import { getCurrentScope, popScope, pushScope } from './api.scope.js';
import { isFinitePositiveNumber } from '../utils.js';
import { _env } from './api.shared.js';

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
  return getCurrentScope().cursor;
}

/**
 * Schedule the function `action` to be called at the cursor position.
 *
 * @param {Function|string} action - The action to schedule as a function or a key
 */
export function fire(action) {
  const memoizedCursor = cursor();
  const memoizedChannel = getDefaultMidiChannel();

  if (cursor() >= now()) {
    schedule(cursor(), () => {
      callScoped(memoizedCursor, memoizedChannel, action);
    });
  }
}

/**
 * Repeatedly calls the function `action` every `interval`, `count` times, starting at the cursor position.
 *
 * @param {number} interval - The repeat interval as a strictly positive number
 * @param {Function|string} action - The action to repeat as a function or a key
 * @param {number} count - How many times to repeat. Defaults to Infinity.
 */
export function repeat(interval, action, count = Infinity) {
  if (!isFinitePositiveNumber(interval) || count < 0) {
    return;
  }

  const memoizedChannel = getDefaultMidiChannel();
  const schedulerId = getCurrentSchedulerId();
  const t = now();
  let stepCount = 0;
  let nextCursor = cursor();

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
        callScoped(nextCursor, memoizedChannel, () => {
          callAction(action, stepCount++);
        });
        count -= 1;
        nextCursor += interval;
        scheduleNext();
      }
    });
  };

  scheduleNext();
}

function callAction(action, ...args) {
  if (typeof action === 'function') {
    action(...args);
  } else {
    _env[action](...args);
  }
}

function callScoped(cursor, midiChannel, action) {
  pushScope({ cursor, midiChannel });
  callAction(action);
  popScope();
}

/**
 * Move the cursor at position `time`.
 *
 * @param {number} time - Time position to move the cursor to
 */
export function at(time) {
  getCurrentScope().cursor = time;
}

/**
 * Offset the cursor by `duration`.
 *
 * @param {number} duration - Duration to move the cursor by
 */
export function wait(duration) {
  getCurrentScope().cursor += duration;
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

/**
 * Moves the cursor to the next multiple of `interval`.
 * @param interval - Time interval
 */
export function next(interval) {
  if (!isFinitePositiveNumber(interval)) {
    return;
  }

  const t = now();
  let nextCursor = 0;

  for (;;) {
    if (nextCursor >= t) {
      break;
    }

    nextCursor += interval;
  }

  getCurrentScope().cursor = nextCursor;
}
