import { getApiContext } from './api.js';
import { jest } from '@jest/globals';
import { initScheduler, startScheduler } from './cli/scheduler.js';
import { resetNotesCurrentlyOnState } from './cli/midi.js';
import {
  clearPendingLoops,
  deactivatePendingLoops,
  isLoopActive,
} from './api/api.scheduler.js';

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
  initScheduler();
  mockDateNow(4537);
  resetNotesCurrentlyOnState();
  clearPendingLoops();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('fire() schedules an action at current time cursor', () => {
  const { fire, at } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const spy = jest.fn();
  at(10);
  fire(() => spy());

  advanceTime(10001);
  expect(spy).toBeCalled();
});

test('fire() does not schedule in past', () => {
  const { fire, at } = getApiContext(midiOutput, messages);

  startScheduler([]);

  advanceTime(10001);

  const spy = jest.fn();
  at(5);
  fire(() => spy());

  advanceTime(10001);

  expect(spy).not.toBeCalled();
});

test('log() adds a log message', () => {
  const { log } = getApiContext(midiOutput, messages);

  log('Hello, World!');

  expect(messages.length).toBe(1);
});

test('flog() schedules a log message', () => {
  const { at, flog } = getApiContext(midiOutput, messages);

  startScheduler([]);

  at(10);
  flog('Hello, World!');

  expect(messages.length).toBe(0);

  advanceTime(10001);
  expect(messages.length).toBe(1);
});

test('wait() should offset cursor', () => {
  const { wait, cursor } = getApiContext(midiOutput, messages);
  expect(cursor()).toBe(0);
  wait(10);
  expect(cursor()).toBe(10);
});

test('repeat() should repeatedly call a function', () => {
  const { repeat } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const action = jest.fn();

  repeat(1, action, 5);

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
  const { repeat } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const action = jest.fn();

  advanceTime(2000);

  repeat(1, action, 5);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(action).toBeCalledTimes(3);
  expect(action).toHaveBeenLastCalledWith(4);
});

test('repeat() should skip all calls', () => {
  const { repeat } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const action = jest.fn();

  advanceTime(10000);

  repeat(1, action, 5);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(action).toBeCalledTimes(0);
});

test('repeat() ignore invalid intervals', () => {
  const { repeat } = getApiContext(midiOutput, messages);

  [0, null, -5, 'hey'].forEach((interval) => {
    startScheduler([]);
    const action = jest.fn();
    repeat(interval, action, 5);
    advanceTime(5000);
    expect(action).toBeCalledTimes(0);
  });
});

test('repeat() should repeat at infinity', () => {
  const { repeat } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const action = jest.fn();

  repeat(1, action);

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
  const { at, note } = getApiContext(midiOutput, messages);

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
  const { at, note, channel } = getApiContext(midiOutput, messages);

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
  const output = [];
  const { log, clear } = getApiContext(midiOutput, output);

  log('Hello', 'World!');
  expect(output.length).toBe(2);

  clear();
  expect(output.length).toBe(0);
});

test('fclear() schedules a log output clear', () => {
  const output = [];
  const { at, log, fclear } = getApiContext(midiOutput, output);
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

test('pick() picks a random number', () => {
  const { pick } = getApiContext(midiOutput, messages);
  for (let i = 0; i < 100; ++i) {
    const value = pick(10);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(10);
  }
});

test('pick() picks a random character', () => {
  const { pick } = getApiContext(midiOutput, messages);
  for (let i = 0; i < 100; ++i) {
    const value = pick('abcd');
    expect('abcd'.includes(value)).toBeTruthy();
  }
});

test('pick() picks a random array element', () => {
  const { pick } = getApiContext(midiOutput, messages);
  const choices = ['a', 'b', 'c'];
  for (let i = 0; i < 100; ++i) {
    const value = pick(choices);
    expect(choices.includes(value)).toBeTruthy();
  }
});

test('pick() picks a random value between 0 and 1', () => {
  const { pick } = getApiContext(midiOutput, messages);
  for (let i = 0; i < 100; ++i) {
    const value = pick();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(1);
  }
});

test('pick(*) picks a random value between 0 and 1', () => {
  const { pick } = getApiContext(midiOutput, messages);
  const value = pick(null);
  expect(value).toBeGreaterThanOrEqual(0);
  expect(value).toBeLessThanOrEqual(1);
});

test('pick() picks a random rest parameter', () => {
  const { pick } = getApiContext(midiOutput, messages);
  const choices = ['a', 'b', 'c'];
  for (let i = 0; i < 100; ++i) {
    const value = pick(...choices);
    expect(choices.includes(value)).toBeTruthy();
  }
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

test('def() adds to context', () => {
  const apiContext = getApiContext(midiOutput, messages);
  const variable = apiContext.define('fortyTwo', 42);
  expect(variable).toBe(42);
  expect(apiContext.fortyTwo).toBe(42);
});

test('def() does not overwrite', () => {
  const apiContext = getApiContext(midiOutput, messages);
  apiContext.define('fortyTwo', 42);
  const variable = apiContext.define('fortyTwo', 48);
  expect(variable).toBe(42);
  expect(apiContext.fortyTwo).toBe(42);
});

test('set() overwrite variable', () => {
  const apiContext = getApiContext(midiOutput, messages);
  apiContext.set('fortyTwo', 48);
  expect(apiContext.fortyTwo).toBe(48);
});

test('setSpeed() sets speed', () => {
  const apiContext = getApiContext(midiOutput, messages);
  apiContext.setSpeed(42);
  expect(apiContext.getSpeed()).toBe(42);
});

test('speed() sets speed', () => {
  const apiContext = getApiContext(midiOutput, messages);
  apiContext.speed(42);
  expect(apiContext.getSpeed()).toBe(42);
});

test('speed() should not set invalid speed', () => {
  const apiContext = getApiContext(midiOutput, messages);
  expect(() => apiContext.speed('hello')).toThrow();
});

test('speed() should not set negative speed', () => {
  const apiContext = getApiContext(midiOutput, messages);
  expect(() => apiContext.speed(-1)).toThrow();
});

test('speed() should not set speed to zero', () => {
  const apiContext = getApiContext(midiOutput, messages);
  expect(() => apiContext.speed(0)).toThrow();
});

test('speed() should not set speed to NaN', () => {
  const apiContext = getApiContext(midiOutput, messages);
  expect(() => apiContext.speed(NaN)).toThrow();
});

test('speed() should not set speed to Infinity', () => {
  const apiContext = getApiContext(midiOutput, messages);
  expect(() => apiContext.speed(Infinity)).toThrow();
});

test('speed() without parameter only returns current value', () => {
  const apiContext = getApiContext(midiOutput, messages);
  apiContext.setSpeed(42);
  expect(apiContext.speed()).toBe(42);
});

test('ring() creates a ring', () => {
  const apiContext = getApiContext(midiOutput, messages);
  const ring = apiContext.ring('hello', 123, 42, null);
  expect(ring.get(0)).toBe('hello');
  expect(ring.get(1)).toBe(123);
  expect(ring.get(2)).toBe(42);
  expect(ring.get(3)).toBe(null);
  expect(ring.get(4)).toBe('hello');
  expect(ring.get(5)).toBe(123);
  expect(ring.get(6)).toBe(42);
  expect(ring.get(7)).toBe(null);
});

test('ring() iterates over elements', () => {
  const apiContext = getApiContext(midiOutput, messages);
  const ring = apiContext.ring('hello', 123, 42, null);
  const values = [];

  for (let i = 0; i < 10; ++i) {
    values.push(ring.next());
  }

  expect(values).toEqual([
    'hello',
    123,
    42,
    null,
    'hello',
    123,
    42,
    null,
    'hello',
    123,
  ]);
});

test('ring() iterates over elements with move', () => {
  const apiContext = getApiContext(midiOutput, messages);
  const ring = apiContext.ring('hello', 123, 42, null);
  const values = [];

  for (let i = 0; i < 10; ++i) {
    values.push(ring.move(i));
    values.push(ring.peek());
  }

  expect(values).toEqual([
    'hello',
    'hello',
    123,
    123,
    42,
    42,
    null,
    null,
    'hello',
    'hello',
    123,
    123,
    42,
    42,
    null,
    null,
    'hello',
    'hello',
    123,
    123,
  ]);
});

test('iter() iterates over numbers', () => {
  const apiContext = getApiContext(midiOutput, messages);
  const values = [];

  apiContext.iter(5, (i) => values.push(i));

  expect(values).toEqual([0, 1, 2, 3, 4]);
});

test('iter() iterates over strings', () => {
  const apiContext = getApiContext(midiOutput, messages);
  const values = [];

  apiContext.iter('hello', (i) => values.push(i));

  expect(values).toEqual(['h', 'e', 'l', 'l', 'o']);
});

test('iter() iterates over arrays', () => {
  const apiContext = getApiContext(midiOutput, messages);
  const values = [];

  apiContext.iter([1, 2, 3], (i) => values.push(i));

  expect(values).toEqual([1, 2, 3]);
});

test("iter() doesn't iterate over non-iterable arguments", () => {
  const apiContext = getApiContext(midiOutput, messages);
  const values = [];

  apiContext.iter(null, (i) => values.push(i));

  expect(values).toEqual([null]);
});

test('loop() loops over elements', () => {
  const { loop, wait } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const fn = jest.fn();

  const action = () => {
    wait(1);
    fn();
  };

  loop('loop', action);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(3);

  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(7);
});

test('loop() can redefine on-going loop', () => {
  const { loop, wait } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const fn1 = jest.fn();
  const fn2 = jest.fn();

  const action1 = () => {
    wait(1);
    fn1();
  };

  const action2 = () => {
    wait(2);
    fn2();
  };

  loop('loop', action1);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn1).toBeCalledTimes(3);

  loop('loop', action2);

  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn2).toBeCalledTimes(2);
});

test('loop() can be deactivated', () => {
  const { loop, wait } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const fn = jest.fn();

  const action = () => {
    wait(1);
    fn();
  };

  loop('loop', action);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(3);

  deactivatePendingLoops();

  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(3);
});

test('loop() can be cleared', () => {
  const { loop, wait } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const fn = jest.fn();

  const action = () => {
    wait(1);
    fn();
  };

  loop('loop', action);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(3);

  clearPendingLoops();

  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(3);
});

test.skip("loop() can be deactivated and won't be rescheduled in past", () => {
  const { at, loop, wait } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const fn = jest.fn();

  const action = () => {
    wait(1);
    fn();
  };

  loop('loop', action);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(3);

  deactivatePendingLoops();

  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(3);

  at(0);
  loop('loop', action);

  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(3);
});

test('loop() ignores invalid name parameter', () => {
  const { loop, wait } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const fn = jest.fn();

  const action = () => {
    wait(1);
    fn();
  };

  loop(42, action);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(0);
});

test('loop() ignores invalid action parameter', () => {
  const { loop } = getApiContext(midiOutput, messages);

  startScheduler([]);

  loop('loop', 42);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);

  expect(isLoopActive('loop')).toBeFalsy();
});

test('past loop() should be ignored', () => {
  const { loop, wait } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const fn = jest.fn();

  const action = () => {
    wait(1);
    fn();
  };

  advanceTime(1000);

  loop('loop', action);

  advanceTime(1000);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(0);
});

test('loop() should not repeat in past', () => {
  const { loop, wait } = getApiContext(midiOutput, messages);

  startScheduler([]);

  const fn = jest.fn();

  const action = () => {
    wait(-1);
    fn();
  };

  loop('loop', action);

  advanceTime(1);
  advanceTime(1000);
  advanceTime(1000);

  expect(fn).toBeCalledTimes(1);
});

test('next() should move cursor to next multiple of interval', () => {
  const { next, cursor } = getApiContext(midiOutput, messages);

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
  const { at, next, cursor } = getApiContext(midiOutput, messages);

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
