import { iter, pick, ring } from './api.utils.js';

test('pick() picks a random number', () => {
  for (let i = 0; i < 100; ++i) {
    const value = pick(10);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(10);
  }
});

test('pick() picks a random character', () => {
  for (let i = 0; i < 100; ++i) {
    const value = pick('abcd');
    expect('abcd'.includes(value)).toBeTruthy();
  }
});

test('pick() picks a random array element', () => {
  const choices = ['a', 'b', 'c'];
  for (let i = 0; i < 100; ++i) {
    const value = pick(choices);
    expect(choices.includes(value)).toBeTruthy();
  }
});

test('pick() picks a random value between 0 and 1', () => {
  for (let i = 0; i < 100; ++i) {
    const value = pick();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(1);
  }
});

test('pick(*) picks a random value between 0 and 1', () => {
  const value = pick(null);
  expect(value).toBeGreaterThanOrEqual(0);
  expect(value).toBeLessThanOrEqual(1);
});

test('pick() picks a random rest parameter', () => {
  const choices = ['a', 'b', 'c'];
  for (let i = 0; i < 100; ++i) {
    const value = pick(...choices);
    expect(choices.includes(value)).toBeTruthy();
  }
});

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

test('iter() iterates over numbers', () => {
  const values = [];

  iter(5, (i) => values.push(i));

  expect(values).toEqual([0, 1, 2, 3, 4]);
});

test('iter() iterates over strings', () => {
  const values = [];

  iter('hello', (i) => values.push(i));

  expect(values).toEqual(['h', 'e', 'l', 'l', 'o']);
});

test('iter() iterates over arrays', () => {
  const values = [];

  iter([1, 2, 3], (i) => values.push(i));

  expect(values).toEqual([1, 2, 3]);
});

test("iter() doesn't iterate over non-iterable arguments", () => {
  const values = [];

  iter(null, (i) => values.push(i));

  expect(values).toEqual([null]);
});
