import {
  initScheduler,
  clock,
  schedule,
  startScheduler,
  toggleSchedulerPaused,
  isPaused,
  incrementSchedulerId,
  getCurrentSchedulerId,
  decrementSchedulerId,
  getElapsedSeconds,
  setSchedulerSpeed,
} from './scheduler.js';
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
  jest.spyOn(global.Date, 'now').mockImplementation(() => currentTime);
  initScheduler();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('clock() returns 0 when scheduler is stopped', () => {
  expect(clock()).toBe(0);
});

test('clock() returns 0 when scheduler has just started', () => {
  startScheduler([]);
  expect(clock()).toBe(0);
});

test('clock() returns elapsed time when scheduler is running', () => {
  mockDateNow(4537);
  startScheduler([]);
  advanceTime(4000);
  expect(clock()).toBe(4);
});

test('clock() output is affected by scheduler speed', () => {
  mockDateNow(4537);
  startScheduler([]);
  setSchedulerSpeed(10);
  advanceTime(4000);
  expect(clock()).toBe(40);
});

test('getElapsedSeconds() returns the elapsed time in seconds since scheduler start', () => {
  mockDateNow(4537);
  startScheduler([]);
  setSchedulerSpeed(10);
  advanceTime(4000);
  expect(getElapsedSeconds()).toBe(4);
});

test('initScheduler() stops execution', () => {
  mockDateNow(4537);
  startScheduler([]);
  advanceTime(4000);
  initScheduler();
  expect(clock()).toBe(0);
});

test('schedule actions', () => {
  mockDateNow(4537);
  startScheduler([]);

  const spy = jest.fn();
  schedule(10, () => spy());

  advanceTime(10001);
  expect(spy).toBeCalled();
});

test('errors during execution are reported', () => {
  mockDateNow(4537);
  const outputLines = [];
  startScheduler(outputLines);

  const action = () => {
    throw 'Boom!';
  };
  schedule(10, () => action());

  advanceTime(10001);
  expect(outputLines.length).toBe(1);
});

test('schedules actions with equal time in the right order', () => {
  mockDateNow(4537);
  const outputLines = [];
  startScheduler(outputLines);

  let output = '';

  const action1 = () => (output += '1');
  const action2 = () => (output += '2');
  const action3 = () => (output += '3');
  schedule(10, () => action1());
  schedule(10, () => action2());
  schedule(10, () => action3());

  advanceTime(10001);
  expect(output).toBe('123');
});

test('throws error if time is invalid', () => {
  expect(() => schedule(null, () => {})).toThrow();
});

test('toggleSchedulerPaused() pauses and unpauses scheduler', () => {
  mockDateNow(4537);
  startScheduler([]);

  let t = clock();
  toggleSchedulerPaused();
  expect(isPaused()).toBeTruthy();

  advanceTime(4000);
  expect(clock()).toBe(t);

  toggleSchedulerPaused();
  expect(isPaused()).toBeFalsy();
});

test('incrementSchedulerId() increments scheduler ID', () => {
  initScheduler();
  incrementSchedulerId();
  incrementSchedulerId();

  expect(getCurrentSchedulerId()).toBe(2);
});

test('decrementSchedulerId() decrements scheduler ID', () => {
  initScheduler();
  decrementSchedulerId();
  decrementSchedulerId();

  expect(getCurrentSchedulerId()).toBe(-2);
});
