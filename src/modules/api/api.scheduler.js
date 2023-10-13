import {
  getCurrentEventTime,
  getCurrentSchedulerId,
  getSchedulerSpeed,
  schedule,
  setSchedulerSpeed,
} from '../cli/scheduler.js';
import { getDefaultMidiChannel } from './api.midi.js';
import { getCurrentScope, popScope, pushScope } from './api.scope.js';

let loops = {};
let activeLoops = {};

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
 * @param {Function} action - The action to schedule as a function
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
  pushScope({ cursor, midiChannel });
  action();
  popScope();
}

function beginLoop(name, action) {
  loops[name] = action;

  const memoizedChannel = getDefaultMidiChannel();
  let nextCursor = cursor();

  const doItOnce = () => {
    if (loops[name] == null) {
      return;
    }

    if (!isLoopActive(name)) {
      loops[name] = null;
      return;
    }

    if (nextCursor >= now()) {
      schedule(nextCursor, () => {
        pushScope({ midiChannel: memoizedChannel, cursor: nextCursor });

        loops[name]();

        if (cursor() > nextCursor) {
          schedule(cursor(), doItOnce);
        }

        nextCursor = cursor();
        popScope();
      });
    }
  };

  doItOnce();
}

/**
 * Define a named loop or replace an existing one and start it at current cursor
 * position.
 * The function `action` will be called repeatedly if the cursor moves by a positive
 * amount inside the action.
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
    beginLoop(name, action);
  } else {
    loops[name] = action;
  }
}

export function isLoopActive(name) {
  return activeLoops[name] === true;
}

export function deactivatePendingLoops() {
  for (let name of Object.keys(loops)) {
    activeLoops[name] = false;
  }
}

export function clearPendingLoops() {
  loops = {};
  activeLoops = {};
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
