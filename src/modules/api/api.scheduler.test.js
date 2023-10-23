import { getApiContext } from '../api.js';
import { initScheduler, startScheduler } from '../cli/scheduler.js';
import { jest } from '@jest/globals';
import { setPersistedContext } from './api.shared.js';

let currentTime = 0;
let messages = [];

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

  currentTime = 0;
  messages = [];
  setPersistedContext({});
  initScheduler();
  mockDateNow(4537);
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('fire() schedules an action at current time cursor', () => {
  const { fire, at } = getApiContext(null, messages);

  startScheduler([]);

  const spy = jest.fn();
  at(10);
  fire(() => spy());

  advanceTime(10000);
  expect(spy).toBeCalled();
});

test('fire() schedules a named action at current time cursor', () => {
  const { define, fire, at } = getApiContext(null, messages);

  startScheduler([]);

  const spy = jest.fn();
  define('action', () => spy());
  at(10);
  fire('action');

  advanceTime(10000);
  expect(spy).toBeCalled();
});

test('fire() schedules an action at current time cursor', () => {
  const { fire } = getApiContext(null, messages);
  startScheduler([]);
  fire('action');
  advanceTime(1000);
});

test('fire() does not schedule in past', () => {
  const { fire, at } = getApiContext(null, messages);

  startScheduler([]);

  advanceTime(10000);

  const spy = jest.fn();
  at(5);
  fire(() => spy());

  advanceTime(10000);

  expect(spy).not.toBeCalled();
});

test('wait() should offset cursor', () => {
  const { wait, cursor } = getApiContext(null, messages);
  expect(cursor()).toBe(0);
  wait(10);
  expect(cursor()).toBe(10);
});

test('repeat() should repeatedly call a function', () => {
  const { repeat } = getApiContext(null, messages);

  startScheduler([]);

  const action = jest.fn();

  repeat(1, action, 5);

  advanceTime(2000);

  expect(action).toBeCalledTimes(3);
  expect(action).toHaveBeenLastCalledWith(2);

  advanceTime(4000);

  expect(action).toBeCalledTimes(5);
  expect(action).toHaveBeenLastCalledWith(4);
});

test('repeat() should repeatedly call a named function', () => {
  const { repeat, define } = getApiContext(null, messages);

  startScheduler([]);

  const action = jest.fn();

  define('action', action);

  repeat(1, 'action', 5);

  advanceTime(2000);

  expect(action).toBeCalledTimes(3);
  expect(action).toHaveBeenLastCalledWith(2);

  advanceTime(4000);

  expect(action).toBeCalledTimes(5);
  expect(action).toHaveBeenLastCalledWith(4);
});

test('repeat() should skip past calls', () => {
  const { repeat } = getApiContext(null, messages);

  startScheduler([]);

  const action = jest.fn();

  advanceTime(2000);

  repeat(1, action, 5);

  advanceTime(6000);

  expect(action).toBeCalledTimes(3);
  expect(action).toHaveBeenLastCalledWith(4);
});

test('repeat() should skip all calls', () => {
  const { repeat } = getApiContext(null, messages);

  startScheduler([]);

  const action = jest.fn();

  advanceTime(10000);

  repeat(1, action, 5);

  advanceTime(6000);

  expect(action).toBeCalledTimes(0);
});

test('repeat() ignore invalid intervals', () => {
  const { repeat } = getApiContext(null, messages);

  [0, null, -5, 'hey'].forEach((interval) => {
    startScheduler([]);
    const action = jest.fn();
    // @ts-ignore
    repeat(interval, action, 5);
    advanceTime(5000);
    expect(action).toBeCalledTimes(0);
  });
});

test('repeat() should repeat at infinity', () => {
  const { repeat } = getApiContext(null, messages);

  startScheduler([]);

  const action = jest.fn();

  repeat(1, action);

  advanceTime(6000);

  expect(action).toBeCalledTimes(7);
});

test('setSpeed() sets speed', () => {
  const apiContext = getApiContext(null, messages);
  apiContext.setSpeed(42);
  expect(apiContext.getSpeed()).toBe(42);
});

test('speed() sets speed', () => {
  const apiContext = getApiContext(null, messages);
  apiContext.speed(42);
  expect(apiContext.getSpeed()).toBe(42);
});

test('speed() should not set invalid speed', () => {
  const apiContext = getApiContext(null, messages);
  // @ts-ignore
  expect(() => apiContext.speed('hello')).toThrow();
});

test('speed() should not set negative speed', () => {
  const apiContext = getApiContext(null, messages);
  expect(() => apiContext.speed(-1)).toThrow();
});

test('speed() should not set speed to zero', () => {
  const apiContext = getApiContext(null, messages);
  expect(() => apiContext.speed(0)).toThrow();
});

test('speed() should not set speed to NaN', () => {
  const apiContext = getApiContext(null, messages);
  expect(() => apiContext.speed(NaN)).toThrow();
});

test('speed() should not set speed to Infinity', () => {
  const apiContext = getApiContext(null, messages);
  expect(() => apiContext.speed(Infinity)).toThrow();
});

test('speed() without parameter only returns current value', () => {
  const apiContext = getApiContext(null, messages);
  apiContext.setSpeed(42);
  expect(apiContext.speed()).toBe(42);
});

test('next() should move cursor to next multiple of interval', () => {
  const { next, cursor } = getApiContext(null, messages);

  startScheduler([]);

  advanceTime(1000);

  next(10);
  expect(cursor()).toBe(10);

  advanceTime(9000);

  next(10);
  expect(cursor()).toBe(10);

  advanceTime(1);

  next(10);
  expect(cursor()).toBe(20);

  next(7);
  expect(cursor()).toBe(14);
});

test('next() should ignore invalid interval', () => {
  const { at, next, cursor } = getApiContext(null, messages);

  startScheduler([]);

  at(42);

  advanceTime(1000);

  next(0);
  expect(cursor()).toBe(42);

  next(-1);
  expect(cursor()).toBe(42);

  next(null);
  expect(cursor()).toBe(42);

  next(Infinity);
  expect(cursor()).toBe(42);

  next('hello');
  expect(cursor()).toBe(42);
});
