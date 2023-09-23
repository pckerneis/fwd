import { getApi, initApi } from './api.js';
import { jest } from '@jest/globals';
import { initScheduler, startScheduler } from './scheduler.js';

let currentTime = 0;
let messages = [];
const midiOutput = {
  send: jest.fn(),
};

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
  initApi(midiOutput, messages);
  initScheduler();
  mockDateNow(4537);
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('fire() schedules an action at current time cursor', () => {
  const { fire, at } = getApi();

  startScheduler();

  const spy = jest.fn();
  at(10);
  fire(() => spy());

  advanceTime(10001);
  expect(spy).toBeCalled();
});

test('log() adds a log message', () => {
  const { log } = getApi();

  log('Hello, World!');

  expect(messages.length).toBe(1);
});

test('flog() schedules a log message', () => {
  const { at, flog } = getApi();

  startScheduler();

  at(10);
  flog('Hello, World!');

  expect(messages.length).toBe(0);

  advanceTime(10001);
  expect(messages.length).toBe(1);
});

test('wait() should offset cursor', () => {
  const { wait, cursor } = getApi();
  expect(cursor()).toBe(0);
  wait(10);
  expect(cursor()).toBe(10);
});

test('repeat() should repeatedly call a function', () => {
  const { repeat } = getApi();

  startScheduler();

  const action = jest.fn();

  repeat(action, 1, 5);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);

  expect(action).toBeCalledTimes(3);
  expect(action).toHaveBeenLastCalledWith(2);

  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(action).toBeCalledTimes(5);
  expect(action).toHaveBeenLastCalledWith(4);
});

test('repeat() should skip past calls', () => {
  const { repeat } = getApi();

  startScheduler();

  const action = jest.fn();

  advanceTime(2000);

  repeat(action, 1, 5);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(action).toBeCalledTimes(4);
  expect(action).toHaveBeenLastCalledWith(4);
});

test('repeat() should skip all calls', () => {
  const { repeat } = getApi();

  startScheduler();

  const action = jest.fn();

  advanceTime(10000);

  repeat(action, 1, 5);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(action).toBeCalledTimes(0);
});

test('repeat() should repeat at infinity', () => {
  const { repeat } = getApi();

  startScheduler();

  const action = jest.fn();

  repeat(action, 1);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(action).toBeCalledTimes(7);
});

test('note() should schedule MIDI note', () => {
  const { at, note } = getApi();

  startScheduler();

  at(1);
  note(64, 64, 1, 0);

  advanceTime(10001);

  // note on
  expect(midiOutput.send).toBeCalledTimes(1);

  advanceTime(10001);

  // note off
  expect(midiOutput.send).toBeCalledTimes(2);
});
