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
 * @returns the removed events
 */
function removePastEvents(time) {
  const pastEvents = [];

  for (let i = scheduledEvents.length - 1; i >= 0; --i) {
    const event = scheduledEvents[i];

    if (event.time < time) {
      pastEvents.push(...scheduledEvents.splice(i, 1));
    }
  }

  return pastEvents;
}

/**
 * Starts the scheduler
 */
export function startScheduler() {
  stopped = false;

  startTime = Date.now();

  intervalHandle = setInterval(() => {
    const elapsed = now();
    removePastEvents(previousTime);
    const currentEvents = removePastEvents(elapsed);
    currentEvents.forEach((event) => event.action());

    previousTime = elapsed;
  }, 1);
}
