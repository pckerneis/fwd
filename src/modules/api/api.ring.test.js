import { ring } from './api.ring.js';

test('ring() creates a ring', () => {
  const r = ring('hello', 123, 42, null);
  expect(r(0)).toBe('hello');
  expect(r(1)).toBe(123);
  expect(r(2)).toBe(42);
  expect(r(3)).toBe(null);
  expect(r(4)).toBe('hello');
  expect(r(5)).toBe(123);
  expect(r(6)).toBe(42);
  expect(r(7)).toBe(null);
});

test('ring() wraps negative indices', () => {
  const r = ring('hello', 123, 42, null);
  expect(r(-1)).toBe(null);
  expect(r(-2)).toBe(42);
  expect(r(-3)).toBe(123);
  expect(r(-4)).toBe('hello');
  expect(r(-5)).toBe(null);
  expect(r(-6)).toBe(42);
  expect(r(-7)).toBe(123);
  expect(r(-8)).toBe('hello');
});
test('ring() floors non-integer indices', () => {
  const r = ring('hello', 123, 42, null);
  expect(r(0.5)).toBe('hello');
  expect(r(1.5)).toBe(123);
  expect(r(2.5)).toBe(42);
  expect(r(3.5)).toBe(null);
  expect(r(4.5)).toBe('hello');
  expect(r(5.5)).toBe(123);
  expect(r(6.5)).toBe(42);
  expect(r(7.5)).toBe(null);
});
