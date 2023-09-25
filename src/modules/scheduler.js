import { dbg } from './dbg.js';
import { EventQueue } from './event-queue.js';

const LOOK_AHEAD = 0;

const scheduledEvents = new EventQueue();

let startTime = 0;
let previousTime = 0;
let stopped = true;
let intervalHandle;
let currentSchedulerId = 0;

export function getPreviousTime() {
  return previousTime;
}

export function getCurrentSchedulerId() {
  return currentSchedulerId;
}

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
  currentSchedulerId = 0;
}

/**
 * Schedule an action at a given time position
 * @param {number} time the time in seconds at which the action should be performed
 * @param {Function} action the function to be called
 * @param {number} [schedulerId] scheduler ID
 */
export function schedule(time, action, schedulerId) {
  dbg('Schedule at ', time);
  scheduledEvents.add(time, action, schedulerId ?? currentSchedulerId);
}

/**
 * Clear the list of scheduled events
 */
export function clearScheduledEvents() {
  currentSchedulerId++;
}

/**
 * Starts the scheduler
 *
 * @param {string[]} outputLines array of messages to log
 */
export function startScheduler(outputLines) {
  dbg('Start scheduler.');
  stopped = false;

  startTime = Date.now();

  intervalHandle = setInterval(() => {
    const t = now();
    const elapsed = t + LOOK_AHEAD;

    let next = scheduledEvents.next(elapsed);

    while (next != null) {
      if (next.schedulerId === currentSchedulerId) {
        try {
          next.event();
        } catch (e) {
          outputLines.push(e);
        }
      }

      next = scheduledEvents.next(elapsed);
    }

    previousTime = elapsed;
  }, 1);
}
