import { jest } from '@jest/globals';
import {
  getChannelVisualizationData,
  getMidiSent,
  playNote,
  resetMidiSent,
  resetNotesCurrentlyOnState,
  sendCC,
  sendProgramChange,
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

test('should ignore note with invalid parameters', () => {
  [
    {
      channel: -1,
      note: 0,
      velocity: 127,
    },
    {
      channel: 16,
      note: 0,
      velocity: 127,
    },
    {
      channel: 0,
      note: -1,
      velocity: 127,
    },
    {
      channel: 0,
      note: 128,
      velocity: 127,
    },
    {
      channel: 0,
      note: 0,
      velocity: -1,
    },
    {
      channel: 0,
      note: 0,
      velocity: 128,
    },
  ].forEach((values) => {
    playNote(midiOutput, values.channel, values.note, values.velocity, 1);
    expect(midiOutput.send).not.toHaveBeenCalled();
  });
});

test('should ignore program changes with invalid parameters', () => {
  [
    {
      channel: -1,
      program: 0,
    },
    {
      channel: 16,
      program: 0,
    },
    {
      channel: 0,
      program: -1,
    },
    {
      channel: 0,
      program: 128,
    },
  ].forEach((values) => {
    sendProgramChange(midiOutput, values.program, values.channel);
    expect(midiOutput.send).not.toHaveBeenCalled();
  });
});

test('should ignore control changes with invalid parameters', () => {
  [
    {
      channel: -1,
      controller: 0,
      value: 127,
    },
    {
      channel: 16,
      controller: 0,
      value: 127,
    },
    {
      channel: 0,
      controller: -1,
      value: 127,
    },
    {
      channel: 0,
      controller: 128,
      value: 127,
    },
    {
      channel: 0,
      controller: 0,
      value: -1,
    },
    {
      channel: 0,
      controller: 0,
      value: 128,
    },
  ].forEach((values) => {
    sendCC(midiOutput, values.controller, values.value, values.channel);
    expect(midiOutput.send).not.toHaveBeenCalled();
  });
});

test('should send program change message', () => {
  sendProgramChange(midiOutput, 0, 0);
  expect(midiOutput.send).toHaveBeenLastCalledWith('program', {
    channel: 0,
    number: 0,
  });
});

test('should gather channel visualization data', () => {
  playNote(midiOutput, 0, 42, 42, 1);
  playNote(midiOutput, 0, 42, 127, 1);
  playNote(midiOutput, 0, 36, 60, 1);
  playNote(midiOutput, 1, 64, 0, 1);

  const data = getChannelVisualizationData();

  expect(data[0]).toBe(127);
  expect(data[1]).toBe(0);
  expect(data[2]).toBe(0);
});
