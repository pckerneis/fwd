import { dbg } from './dbg.js';
import { EventQueue } from './event-queue.js';

const scheduledEvents = new EventQueue();

let startTime = 0;
let currentEventTime = 0;
let stopped = true;
let intervalHandle;
let currentSchedulerId = 0;

export function getCurrentEventTime() {
  return currentEventTime;
}

export function getCurrentSchedulerId() {
  return currentSchedulerId;
}

/**
 * Returns the elapsed time in seconds since scheduler start
 * @returns 0 when stopped or elapsed time in seconds when running
 */
export function clock() {
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
  currentEventTime = 0;
  currentSchedulerId = 0;
}

/**
 * Schedule an action at a given time position
 * @param {number} time the time in seconds at which the action should be performed
 * @param {Function} action the function to be called
 */
export function schedule(time, action) {
  dbg('Schedule at ', time);
  scheduledEvents.add(time, action);
}

/**
 * Clear the list of scheduled events
 */
export function incrementSchedulerId() {
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
    const t = clock();

    let next = scheduledEvents.next(t);

    while (next != null) {
      currentEventTime = next.time;

      try {
        next.event();
      } catch (e) {
        outputLines.push(e);
      }

      next = scheduledEvents.next(t);
    }

    currentEventTime = t;
  }, 1);
}
