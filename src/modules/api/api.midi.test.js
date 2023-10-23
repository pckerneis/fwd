import { getApiContext } from '../api.js';
import { initScheduler, startScheduler } from '../cli/scheduler.js';
import {
  getMuteChannels,
  getSoloChannels,
  resetMuteAndSolo,
} from './api.midi.js';
import { jest } from '@jest/globals';
import { setPersistedContext } from './api.shared.js';
import { resetNotesCurrentlyOnState } from '../cli/midi.js';

let currentTime = 0;
let messages = [];
let midiOutput;

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
  midiOutput = {
    send: jest.fn(),
  };
  setPersistedContext({});
  initScheduler();
  mockDateNow(4537);
  resetNotesCurrentlyOnState();
  resetMuteAndSolo();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('note() should schedule MIDI note', () => {
  const { at, note } = getApiContext(midiOutput, messages);

  startScheduler([]);

  at(1);
  note(64, 64, 1, 0);

  advanceTime(10000);

  // note on
  expect(midiOutput.send).toBeCalledTimes(1);

  advanceTime(10000);

  // note off
  expect(midiOutput.send).toBeCalledTimes(2);
});

test('note() should schedule MIDI note with default channel', () => {
  const { at, note, channel } = getApiContext(midiOutput, messages);

  startScheduler([]);

  channel(4);
  at(1);
  note(64, 64, 1);

  advanceTime(10000);

  // note on
  expect(midiOutput.send).toHaveBeenLastCalledWith('noteon', {
    note: 64,
    velocity: 64,
    channel: 4,
  });
});

test('channel() resets default channel', () => {
  const output = [];
  const { at, program, channel } = getApiContext(midiOutput, output);
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

test('mute() should mute channel', () => {
  const { note, mute } = getApiContext(midiOutput, messages);

  startScheduler([]);

  mute(0);
  note(64, 127, 0);

  advanceTime(1000);

  expect(midiOutput.send).toBeCalledTimes(0);
});

test('mute() should mute all channels', () => {
  const { note, mute } = getApiContext(midiOutput, messages);

  startScheduler([]);

  mute();

  for (let channel = 0; channel < 16; ++channel) {
    note(64, 127, channel);
  }

  advanceTime(1000);

  expect(midiOutput.send).toBeCalledTimes(0);
  expect(getMuteChannels().length).toBe(16);
});

test('mute() should ignore already muted channel', () => {
  const { mute } = getApiContext(midiOutput, messages);

  startScheduler([]);

  mute(0);
  mute(0);

  advanceTime(1);

  expect(getMuteChannels().length).toBe(1);
});

test('unmute() should unmute channel', () => {
  const { note, mute, unmute } = getApiContext(midiOutput, messages);

  startScheduler([]);

  mute();
  unmute(2);
  note(64, 127, 1, 2);

  advanceTime(1);

  expect(midiOutput.send).toBeCalledTimes(1);
});

test('unmute() should unmute all channels', () => {
  const { note, mute, unmute } = getApiContext(midiOutput, messages);

  startScheduler([]);

  mute();
  unmute();

  for (let channel = 0; channel < 16; ++channel) {
    note(64, 127, 1, channel);
  }

  advanceTime(1);

  expect(midiOutput.send).toBeCalledTimes(16);
});

test('unmute() should ignore already unmuted channel', () => {
  const { mute, unmute } = getApiContext(midiOutput, messages);

  startScheduler([]);

  mute();
  unmute(0);
  unmute(0);

  advanceTime(10);

  expect(getMuteChannels().length).toBe(15);
});

test('solo() should solo channel', () => {
  const { note, solo } = getApiContext(midiOutput, messages);

  startScheduler([]);

  solo(0);

  for (let channel = 0; channel < 16; ++channel) {
    note(64, 127, 1, channel);
  }

  advanceTime(1);

  expect(midiOutput.send).toBeCalledTimes(1);
});

test('solo() should solo all channels', () => {
  const { note, solo } = getApiContext(midiOutput, messages);

  startScheduler([]);

  solo();

  for (let channel = 0; channel < 16; ++channel) {
    note(64, 127, 1, channel);
  }

  advanceTime(1);

  expect(midiOutput.send).toBeCalledTimes(16);
  expect(getSoloChannels().length).toBe(16);
});

test('solo() should ignore already soloed channel', () => {
  const { solo } = getApiContext(midiOutput, messages);

  startScheduler([]);

  solo(0);
  solo(0);

  advanceTime(1);

  expect(getSoloChannels().length).toBe(1);
});

test('unsolo() should unsolo channel', () => {
  const { note, solo, unsolo } = getApiContext(midiOutput, messages);

  startScheduler([]);

  solo();
  unsolo(2);

  for (let channel = 0; channel < 16; ++channel) {
    note(64, 127, 1, channel);
  }

  advanceTime(1);

  expect(midiOutput.send).toBeCalledTimes(15);
});

test('unsolo() should unsolo all channels', () => {
  const { note, solo, unsolo } = getApiContext(midiOutput, messages);

  startScheduler([]);

  solo();
  unsolo();

  for (let channel = 0; channel < 16; ++channel) {
    note(64, 127, 1, channel);
  }

  advanceTime(1);

  expect(midiOutput.send).toBeCalledTimes(16);
});

test('unsolo() should ignore already unsoloed channel', () => {
  const { solo, unsolo } = getApiContext(midiOutput, messages);

  startScheduler([]);

  solo();
  unsolo(0);
  unsolo(0);

  advanceTime(10);

  expect(getSoloChannels().length).toBe(15);
});

test('program() schedules a MIDI program change', () => {
  const output = [];
  const { at, program } = getApiContext(midiOutput, output);
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
  const output = [];
  const { at, program, channel } = getApiContext(midiOutput, output);
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

test('program() ignores inactivated channel', () => {
  const output = [];
  const { at, program, mute } = getApiContext(midiOutput, output);
  startScheduler(output);

  mute(1);
  at(1);
  program(12, 1);

  advanceTime(2000);
  expect(midiOutput.send).toBeCalledTimes(0);
});

test('cc() schedules a MIDI continuous controller change', () => {
  const output = [];
  const { at, cc } = getApiContext(midiOutput, output);
  startScheduler(output);

  at(1);
  cc(12, 42, 1);

  advanceTime(2000);
  expect(midiOutput.send).toHaveBeenLastCalledWith('cc', {
    controller: 12,
    value: 42,
    channel: 1,
  });
});

test('cc() schedules a MIDI cc change on default channel', () => {
  const output = [];
  const { at, cc, channel } = getApiContext(midiOutput, output);
  startScheduler(output);

  at(1);
  channel(3);
  cc(12, 42);

  advanceTime(2000);
  expect(midiOutput.send).toHaveBeenLastCalledWith('cc', {
    controller: 12,
    value: 42,
    channel: 3,
  });
});

test('cc() ignores inactivated channel', () => {
  const output = [];
  const { at, cc, mute } = getApiContext(midiOutput, output);
  startScheduler(output);

  mute(1);
  at(1);
  cc(12, 42, 1);

  advanceTime(2000);
  expect(midiOutput.send).toBeCalledTimes(0);
});
