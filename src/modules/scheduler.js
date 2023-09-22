import { dbg } from './dbg.js';

const LOOK_AHEAD = 0.5;

const scheduledEvents = [];

let startTime = 0;
let previousTime = 0;
let stopped = true;
let intervalHandle;

/**
 * Returns the elapsed time in seconds since scheduler start
 * @returns 0 when stopped or elapsed time in seconds when running
 */
export function now() {
  return stopped ? 0 : (Date.now() - startTime) / 1000;
}

/**
 * Reset the scheduler to its default state
 */
export function initScheduler() {
  dbg('Initialise scheduler.');
  stopped = true;
  clearInterval(intervalHandle);
  intervalHandle = null;
  startTime = 0;
  previousTime = 0;
}

/**
 * Schedule an action at a given time position
 * @param {number} time the time in seconds at which the action should be performed
 * @param {Function} action the function to be called
 */
export function schedule(time, action) {
  dbg('Schedule at ', time);
  scheduledEvents.push({ time, action });
}

/**
 * Clear the list of scheduled events
 */
export function clearScheduledEvents() {
  scheduledEvents.splice(0, scheduledEvents.length);
}

/**
 * Remove and return the scheduled events whose time is below the specified time
 *
 * @param {number} time time in seconds before which events should be removed
 * @param {boolean} includeNow if true, events at time will be removed
 * @returns the removed events
 */
function removePastEvents(time, includeNow = false) {
  const pastEvents = [];

  for (let i = scheduledEvents.length - 1; i >= 0; --i) {
    const event = scheduledEvents[i];

    if (event.time < time || (includeNow && event.time === time)) {
      pastEvents.push(...scheduledEvents.splice(i, 1));
    }
  }

  return pastEvents;
}

/**
 * Starts the scheduler
 */
export function startScheduler() {
  dbg('Start scheduler.');
  stopped = false;

  startTime = Date.now();

  intervalHandle = setInterval(() => {
    const elapsed = now() + LOOK_AHEAD;
    const currentEvents = removePastEvents(elapsed, true);
    currentEvents.forEach((event) => event.action());

    previousTime = now();
  }, 1);
}
