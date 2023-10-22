import { jest } from '@jest/globals';
import { stepper } from './api.stepper.js';

test('Stepper#at() should call the handler function', () => {
  const handler = jest.fn();
  const step = stepper('123~', handler);

  step.at(0);
  expect(handler).toHaveBeenLastCalledWith({
    duration: 1,
    symbol: 1,
    line: 0,
  });
  expect(handler).toHaveBeenCalledTimes(1);
  step.at(1);
  expect(handler).toHaveBeenLastCalledWith({
    duration: 1,
    symbol: 2,
    line: 0,
  });
  expect(handler).toHaveBeenCalledTimes(2);
  step.at(2);
  expect(handler).toHaveBeenLastCalledWith({
    duration: 2,
    symbol: 3,
    line: 0,
  });
  expect(handler).toHaveBeenCalledTimes(3);
  step.at(3);
  expect(handler).toHaveBeenCalledTimes(3);
  step.at(4);
  expect(handler).toHaveBeenLastCalledWith({
    duration: 1,
    symbol: 1,
    line: 0,
  });
  expect(handler).toHaveBeenCalledTimes(4);
  step.at(5);
  expect(handler).toHaveBeenLastCalledWith({
    duration: 1,
    symbol: 2,
    line: 0,
  });
  expect(handler).toHaveBeenCalledTimes(5);
  step.at(6);
  expect(handler).toHaveBeenLastCalledWith({
    duration: 2,
    symbol: 3,
    line: 0,
  });
  expect(handler).toHaveBeenCalledTimes(6);
  step.at(7);
  expect(handler).toHaveBeenCalledTimes(6);
});

test('stepper() should return a stepper with default continuation', () => {
  const handler = jest.fn();
  const step = stepper('1~~.~~', handler);

  step.at(0);
  expect(handler).toHaveBeenLastCalledWith({
    duration: 3,
    symbol: 1,
    line: 0,
  });
});

test('stepper() should return a stepper with custom continuation', () => {
  const handler = jest.fn();
  const step = stepper('1.~~.~~', handler, '.');

  step.at(0);
  expect(handler).toHaveBeenLastCalledWith({
    duration: 2,
    symbol: 1,
    line: 0,
  });
});

test('stepper() should handle multiline patterns', () => {
  const handler = jest.fn();
  const step = stepper(
    `aa.
ab
`,
    handler,
  );

  step.at(0);
  expect(handler).toHaveBeenCalledTimes(2);
  expect(handler).toHaveBeenNthCalledWith(1, {
    duration: 1,
    symbol: 'a',
    line: 0,
  });
  expect(handler).toHaveBeenNthCalledWith(2, {
    duration: 1,
    symbol: 'a',
    line: 1,
  });

  step.at(1);
  expect(handler).toHaveBeenCalledTimes(4);
  expect(handler).toHaveBeenNthCalledWith(3, {
    duration: 1,
    symbol: 'a',
    line: 0,
  });
  expect(handler).toHaveBeenNthCalledWith(4, {
    duration: 1,
    symbol: 'b',
    line: 1,
  });

  step.at(2);
  expect(handler).toHaveBeenCalledTimes(5);

  step.at(3);
  expect(handler).toHaveBeenCalledTimes(7);
});

test('stepper() should ignore whitespace', () => {
  const handler = jest.fn();
  const step = stepper(`a   b\tc`, handler);
  step.at(0);
  expect(handler).toHaveBeenCalledTimes(1);
  step.at(1);
  expect(handler).toHaveBeenCalledTimes(2);
  step.at(2);
  expect(handler).toHaveBeenCalledTimes(3);
});
