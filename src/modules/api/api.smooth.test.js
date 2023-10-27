import { smooth } from './api.smooth.js';
import { at } from './api.scheduler.js';
import { resetScopes } from './api.scope.js';

beforeEach(() => {
  resetScopes();
});

test('smooth() should return a smooth value with default value', () => {
  const value = smooth();
  expect(value.get()).toBe(0);
});

test('smooth() should return a smooth value with linear curve', () => {
  const value = smooth();
  value.setTarget(10, 2);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(5);

  at(2);
  expect(value.get()).toBe(10);

  at(3);
  expect(value.get()).toBe(10);
});

test('smooth() should compute a value with non overlapping segments', () => {
  const value = smooth();
  value.setTarget(10, 2);

  at(3);
  value.setTarget(0, 2);

  at(0);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(5);

  at(2);
  expect(value.get()).toBe(10);

  at(3);
  expect(value.get()).toBe(10);

  at(4);
  expect(value.get()).toBe(5);

  at(5);
  expect(value.get()).toBe(0);
});

test('smooth() should compute a value with overlapping segments', () => {
  const value = smooth();
  value.setTarget(10, 2);

  at(1);
  value.setTarget(0, 2);

  at(0);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(5);

  at(2);
  expect(value.get()).toBe(2.5);

  at(3);
  expect(value.get()).toBe(0);

  at(4);
  expect(value.get()).toBe(0);
});

test('SmoothValue#get should return the default value if no segment is defined', () => {
  const value = smooth(10);
  expect(value.get()).toBe(10);
});

test('SmoothValue#get should return the default value if the cursor is before the first segment', () => {
  const value = smooth(10);
  at(5);
  value.setTarget(100, 2);

  at(0);
  expect(value.get()).toBe(10);
});

test('SmoothValue#setTarget should discard following segments', () => {
  const value = smooth();

  at(1);
  value.setTarget(100, 10);

  at(0);
  expect(value.get()).toBe(0);
  value.setTarget(10, 2);

  at(0);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(5);

  at(2);
  expect(value.get()).toBe(10);

  at(3);
  expect(value.get()).toBe(10);

  at(4);
  expect(value.get()).toBe(10);
});

test('SmoothValue#setTarget should use default duration', () => {
  const value = smooth();

  at(1);
  value.setTarget(10);

  at(0);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(10);

  at(2);
  expect(value.get()).toBe(10);
});
