import { jest } from '@jest/globals';
import { setEnv } from './api.shared.js';
import { initScheduler, startScheduler } from '../cli/scheduler.js';
import { getApiContext } from '../api.js';

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
  setEnv({});
  initScheduler();
  mockDateNow(4537);
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('log() adds a log message', () => {
  const { log } = getApiContext(null, messages);

  log('Hello, World!');

  expect(messages.length).toBe(1);
});

test('flog() schedules a log message', () => {
  const { at, flog } = getApiContext(null, messages);

  startScheduler([]);

  at(10);
  flog('Hello, World!');

  expect(messages.length).toBe(0);

  advanceTime(10000);
  expect(messages.length).toBe(1);
});

test('clear() clears log output', () => {
  const output = [];
  const { log, clear } = getApiContext(null, output);

  log('Hello', 'World!');
  expect(output.length).toBe(2);

  clear();
  expect(output.length).toBe(0);
});

test('fclear() schedules a log output clear', () => {
  const output = [];
  const { at, log, fclear } = getApiContext(null, output);
  startScheduler(output);

  log('Hello', 'World!');
  expect(output.length).toBe(2);

  at(1);
  fclear();
  expect(output.length).toBe(2);

  advanceTime(2000);
  expect(output.length).toBe(0);
});
