import { jest } from '@jest/globals';
import {
  getMidiSent,
  playNote,
  resetMidiSent,
  resetNotesCurrentlyOnState,
  sendProgramChange,
  setDefaultMidiChannel,
} from './midi.js';

let midiOutput;

beforeEach(() => {
  jest.useFakeTimers();

  midiOutput = {
    send: jest.fn(),
  };

  resetNotesCurrentlyOnState();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('should notify when midi signal gets sent', () => {
  playNote(midiOutput, 0, 0, 0, 0);
  expect(getMidiSent()).toBeTruthy();
});

test('should reset midi sent notification', () => {
  playNote(midiOutput, 0, 0, 0, 0);
  resetMidiSent();
  expect(getMidiSent()).toBeFalsy();
});

test('should use default values', () => {
  playNote(midiOutput, null, 0, null, 1);

  expect(midiOutput.send).toHaveBeenLastCalledWith('noteon', {
    note: 0,
    velocity: 127,
    channel: 0,
  });

  jest.runOnlyPendingTimers();

  expect(midiOutput.send).toHaveBeenLastCalledWith('noteoff', {
    note: 0,
    velocity: 0,
    channel: 0,
  });
});

test('should avoid overlapping notes', () => {
  playNote(midiOutput, 0, 0, 127, 1);
  setTimeout(() => playNote(midiOutput, 0, 0, 127, 1), 500);

  jest.advanceTimersByTime(500);
  expect(midiOutput.send).toHaveBeenCalledTimes(3);
  expect(midiOutput.send).toHaveBeenNthCalledWith(1, 'noteon', {
    channel: 0,
    note: 0,
    velocity: 127,
  });
  expect(midiOutput.send).toHaveBeenNthCalledWith(2, 'noteoff', {
    channel: 0,
    note: 0,
    velocity: 0,
  });
  expect(midiOutput.send).toHaveBeenNthCalledWith(3, 'noteon', {
    channel: 0,
    note: 0,
    velocity: 127,
  });

  jest.advanceTimersByTime(1000);
  expect(midiOutput.send).toHaveBeenCalledTimes(4);
  expect(midiOutput.send).toHaveBeenLastCalledWith('noteoff', {
    channel: 0,
    note: 0,
    velocity: 0,
  });
});

test('should send program change message', () => {
  sendProgramChange(midiOutput, 0, 0);
  expect(midiOutput.send).toHaveBeenLastCalledWith('program', {
    channel: 0,
    number: 0,
  });
});

test('should set default channel', () => {
  setDefaultMidiChannel(9);

  playNote(midiOutput, undefined, 48, 127, 1);
  expect(midiOutput.send).toHaveBeenLastCalledWith('noteon', {
    channel: 9,
    note: 48,
    velocity: 127,
  });

  sendProgramChange(midiOutput, 12, undefined);
  expect(midiOutput.send).toHaveBeenLastCalledWith('program', {
    channel: 9,
    number: 12,
  });
});

test('should reset default channel', () => {
  setDefaultMidiChannel();

  playNote(midiOutput, undefined, 48, 127, 1);
  expect(midiOutput.send).toHaveBeenLastCalledWith('noteon', {
    channel: 0,
    note: 48,
    velocity: 127,
  });
});
