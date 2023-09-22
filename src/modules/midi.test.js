import { jest } from '@jest/globals';
import { getMidiSent, playNote, resetMidiSent } from './midi.js';

let midiOutput;

beforeEach(() => {
  jest.useFakeTimers();

  midiOutput = {
    send: jest.fn(),
  };
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
    velocity: 127,
    channel: 0,
  });
});
