import { jest } from '@jest/globals';
import {
  getMidiSent,
  playNote,
  resetMidiSent,
  resetNotesCurrentlyOnState, sendCC,
  sendProgramChange
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
  sendCC(midiOutput, 0, 0, 0);
  sendCC(midiOutput, 8, 10, 0);
  sendCC(midiOutput, 80, 100, 2);
  expect(getMidiSent().length).toBe(2);
  expect(getMidiSent().includes(0)).toBeTruthy();
  expect(getMidiSent().includes(2)).toBeTruthy();
});

test('should reset midi sent notification', () => {
  playNote(midiOutput, 0, 0, 0, 0);
  resetMidiSent();
  expect(getMidiSent().length).toBe(0);
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

  sendProgramChange(midiOutput, 1);

  expect(midiOutput.send).toHaveBeenLastCalledWith('program', {
    number: 1,
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
