import { getApi, initApi } from './api.js';
import { jest } from '@jest/globals';
import { initScheduler, startScheduler } from './scheduler.js';
import { resetNotesCurrentlyOnState } from './midi.js';

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
  resetNotesCurrentlyOnState();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('fire() schedules an action at current time cursor', () => {
  const { fire, at } = getApi();

  startScheduler([]);

  const spy = jest.fn();
  at(10);
  fire(() => spy());

  advanceTime(10001);
  expect(spy).toBeCalled();
});

test('fire() does not schedule in past', () => {
  const { fire, at } = getApi();

  startScheduler([]);

  advanceTime(10001);

  const spy = jest.fn();
  at(5);
  fire(() => spy());

  advanceTime(10001);

  expect(spy).not.toBeCalled();
});

test('log() adds a log message', () => {
  const { log } = getApi();

  log('Hello, World!');

  expect(messages.length).toBe(1);
});

test('flog() schedules a log message', () => {
  const { at, flog } = getApi();

  startScheduler([]);

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

  startScheduler([]);

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

  startScheduler([]);

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

  startScheduler([]);

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

  startScheduler([]);

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

  startScheduler([]);

  at(1);
  note(64, 64, 1, 0);

  advanceTime(10001);

  // note on
  expect(midiOutput.send).toBeCalledTimes(1);

  advanceTime(10001);

  // note off
  expect(midiOutput.send).toBeCalledTimes(2);
});

test('note() should schedule MIDI note with default channel', () => {
  const { at, note, channel } = getApi();

  startScheduler([]);

  channel(4);
  at(1);
  note(64, 64, 1);

  advanceTime(10001);

  // note on
  expect(midiOutput.send).toHaveBeenLastCalledWith('noteon', {
    note: 64,
    velocity: 64,
    channel: 4,
  });
});

test('clear() clears log output', () => {
  const { log, clear } = getApi();
  const output = [];
  initApi(midiOutput, output);

  log('Hello', 'World!');
  expect(output.length).toBe(2);

  clear();
  expect(output.length).toBe(0);
});

test('fclear() schedules a log output clear', () => {
  const { at, log, fclear } = getApi();
  const output = [];
  initApi(midiOutput, output);
  startScheduler(output);

  log('Hello', 'World!');
  expect(output.length).toBe(2);

  at(1);
  fclear();
  expect(output.length).toBe(2);

  advanceTime(2000);
  expect(output.length).toBe(0);
});

test('program() schedules a MIDI program change', () => {
  const { at, program } = getApi();
  const output = [];
  initApi(midiOutput, output);
  startScheduler(output);

  at(1);
  program(12, 1);

  advanceTime(2000);
  expect(midiOutput.send).toHaveBeenLastCalledWith('program', {
    number: 12,
    channel: 1,
  });
});

test('program() schedules a MIDI program change with default channel', () => {
  const { at, program, channel } = getApi();
  const output = [];
  initApi(midiOutput, output);
  startScheduler(output);

  at(1);
  channel(9);
  program(12);

  advanceTime(2000);
  expect(midiOutput.send).toHaveBeenLastCalledWith('program', {
    number: 12,
    channel: 9,
  });
});

test('pick() picks a random number', () => {
  const { pick } = getApi();
  for (let i = 0; i < 100; ++i) {
    const value = pick(10);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(10);
  }
});

test('pick() picks a random character', () => {
  const { pick } = getApi();
  for (let i = 0; i < 100; ++i) {
    const value = pick('abcd');
    expect('abcd'.includes(value)).toBeTruthy();
  }
});

test('pick() picks a random array element', () => {
  const { pick } = getApi();
  const choices = ['a', 'b', 'c'];
  for (let i = 0; i < 100; ++i) {
    const value = pick(choices);
    expect(choices.includes(value)).toBeTruthy();
  }
});

test('pick() picks a random value between 0 and 1', () => {
  const { pick } = getApi();
  for (let i = 0; i < 100; ++i) {
    const value = pick();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(1);
  }
});

test('channel() resets default channel', () => {
  const { at, program, channel } = getApi();
  const output = [];
  initApi(midiOutput, output);
  startScheduler(output);

  at(1);
  channel();
  program(12);

  advanceTime(2000);
  expect(midiOutput.send).toHaveBeenLastCalledWith('program', {
    number: 12,
    channel: 0,
  });
});
