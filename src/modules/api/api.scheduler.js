import {
  getCurrentEventTime,
  getCurrentSchedulerId,
  schedule,
} from '../scheduler.js';

let _cursor;

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
 * @param {number} interval - The repeat interval as a strictly positive number of seconds
 * @param {Function} action - The action to repeat
 * @param {number} count - How many times to repeat. Defaults to Infinity.
 */
export function repeat(interval, action, count = Infinity) {
  if (typeof interval !== 'number' || Number.isNaN(interval) || interval <= 0) {
    return;
  }

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
