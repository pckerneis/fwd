import { random, setSeed } from './api.random.js';

test('random() should return a predictable random number', () => {
  setSeed('hello, musch!');
  expect(random()).toBe(0.6235711870582765);
});

test('random() should return random numbers with a positive max value', () => {
  setSeed('hello, musch!');
  expect(random(42)).toBe(0.6235711870582765 * 42);
});

test('random() should return random numbers with a negative max value', () => {
  setSeed('hello, musch!');
  expect(random(-42)).toBe(-0.6235711870582765 * 42);
});

test('random() should return 0 if max is 0', () => {
  setSeed('hello, musch!');
  expect(random(0)).toBe(0);
});

test('random() should return random numbers between 0 and 1 if arguments are not numbers', () => {
  setSeed('hello, musch!');
  expect(random(null)).toBe(0.6235711870582765);
});

test('random() should return random numbers between min and max values', () => {
  setSeed('hello, musch!');
  expect(random(10, 42)).toBe(10 + 0.6235711870582765 * 32);
});

test('random() should return random numbers between max and min values', () => {
  setSeed('hello, musch!');
  expect(random(42, 10)).toBe(10 + 0.6235711870582765 * 32);
});
