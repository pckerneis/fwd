import { EventQueue } from './event-queue.js';

test('should create a new EventQueue', () => {
  const queue = new EventQueue();
  expect(queue).toBeDefined();
});

test('should add an event to the queue', () => {
  const queue = new EventQueue();
  const event = () => {};
  queue.add(0, event);
  expect(queue.events.length).toBe(1);
  expect(queue.events[0].time).toBe(0);
  expect(queue.events[0].event).toBeDefined();
  expect(queue.events[0].ref).toBeDefined();
  expect(queue.next(0).event).toBe(event);
});

test('should add an event to the queue at the right position', () => {
  const queue = new EventQueue();
  const event1 = () => {};
  const event2 = () => {};
  queue.add(0, event1);
  queue.add(1, event2);
  expect(queue.events.length).toBe(2);
  expect(queue.events[0].time).toBe(0);
  expect(queue.events[0].event).toBe(event1);
  expect(queue.events[0].ref).toBeDefined();
  expect(queue.events[1].time).toBe(1);
  expect(queue.events[1].event).toBe(event2);
  expect(queue.events[1].ref).toBeDefined();
  expect(queue.next(0).event).toBe(event1);
  expect(queue.next(1).event).toBe(event2);
});

test('should insert 10000 events at random time in correct order', () => {
  const queue = new EventQueue();
  const events = [];
  for (let i = 0; i < 10000; i++) {
    const time = Math.floor(Math.random() * 100);
    const event = () => {};
    events.push({ time, event });
    queue.add(time, event);
  }
  expect(queue.events.length).toBe(10000);
  events.sort((a, b) => a.time - b.time);
  for (let i = 0; i < 10000; i++) {
    expect(queue.next(events[i].time).event).toBe(events[i].event);
  }
});
