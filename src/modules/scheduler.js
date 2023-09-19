const scheduledEvents = [];
let startTime = 0;
let previousTime = 0;

export function schedule(time, action) {
  scheduledEvents.push({ time, action });
}

export function clearScheduledEvents() {
  scheduledEvents.splice(0, scheduledEvents.length);
}

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

export function now() {
  return (Date.now() - startTime) / 1000;
}

export function startScheduler() {
  startTime = Date.now();

  setInterval(() => {
    const elapsed = now();
    removePastEvents(previousTime);
    const currentEvents = removePastEvents(elapsed);
    currentEvents.forEach((event) => event.action());

    previousTime = elapsed;
  });
}
