import { clearScheduledEvents, initScheduler, now, schedule, startScheduler } from "./scheduler.js";
import { jest } from '@jest/globals';

let currentTime = 0;

function mockDateNow(time) {
  currentTime = time;
}

function advanceTime(duration) {
  currentTime += duration;
  jest.runOnlyPendingTimers();
}

beforeEach(() => {
  jest.useFakeTimers();

  jest
    .spyOn(global.Date, 'now')
    .mockImplementation(() => currentTime);
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('now() returns 0 when scheduler is stopped', () => {
  expect(now()).toBe(0);
});

test('now() returns 0 when scheduler has just started', () => {
  startScheduler();
  expect(now()).toBe(0);
});

test('now() returns elapsed time in seconds when scheduler is running', () => {
  mockDateNow(4537);
  startScheduler();
  advanceTime(4000);
  expect(now()).toBe(4);
});

test('initScheduler() stops execution', () => {
  mockDateNow(4537);
  startScheduler();
  advanceTime(4000);
  initScheduler();
  expect(now()).toBe(0);
});

test('schedule actions', () => {
  mockDateNow(4537);
  startScheduler();

  const spy = jest.fn();
  schedule(10, () => spy());

  advanceTime(10001);
  expect(spy).toBeCalled();
});


test('clearScheduledEvents() cancel scheduled actions', () => {
  mockDateNow(4537);
  startScheduler();

  const spy = jest.fn();
  schedule(10, () => spy());
  clearScheduledEvents();

  advanceTime(10001);
  expect(spy).not.toBeCalled();
});