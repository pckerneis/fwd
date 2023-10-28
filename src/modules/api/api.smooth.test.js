import { Curve, smooth } from './api.smooth.js';
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

test('smooth() should return a smooth value with easeInQuad curve', () => {
  const value = smooth(0, Curve.easeInQuad);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(0.625);

  at(2);
  expect(value.get()).toBe(2.5);

  at(3);
  expect(value.get()).toBe(5.625);

  at(4);
  expect(value.get()).toBe(10);
});

test('smooth() should return a smooth value with easeOutQuad curve', () => {
  const value = smooth(0, Curve.easeOutQuad);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(4.375);

  at(2);
  expect(value.get()).toBe(7.5);

  at(3);
  expect(value.get()).toBe(9.375);

  at(4);
  expect(value.get()).toBe(10);
});

test('smooth() should return a smooth value with easeInOutQuad curve', () => {
  const value = smooth(0, Curve.easeInOutQuad);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(1.25);

  at(2);
  expect(value.get()).toBe(5);

  at(3);
  expect(value.get()).toBe(8.75);

  at(4);
  expect(value.get()).toBe(10);
});

test('smooth() should return a smooth value with easeInCubic curve', () => {
  const value = smooth(0, Curve.easeInCubic);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(0.15625);

  at(2);
  expect(value.get()).toBe(1.25);

  at(3);
  expect(value.get()).toBe(4.21875);

  at(4);
  expect(value.get()).toBe(10);
});

test('smooth() should return a smooth value with easeOutCubic curve', () => {
  const value = smooth(0, Curve.easeOutCubic);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(5.78125);

  at(2);
  expect(value.get()).toBe(8.75);

  at(3);
  expect(value.get()).toBe(9.84375);

  at(4);
  expect(value.get()).toBe(10);
});

test('smooth() should return a smooth value with easeInOutCubic curve', () => {
  const value = smooth(0, Curve.easeInOutCubic);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(0.625);

  at(2);
  expect(value.get()).toBe(5);

  at(3);
  expect(value.get()).toBe(9.375);

  at(4);
  expect(value.get()).toBe(10);
});

test('smooth() should return a smooth value with easeInQuart curve', () => {
  const value = smooth(0, Curve.easeInQuart);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(0.0390625);

  at(2);
  expect(value.get()).toBe(0.625);

  at(3);
  expect(value.get()).toBe(3.1640625);

  at(4);
  expect(value.get()).toBe(10);
});

test('smooth() should return a smooth value with easeOutQuart curve', () => {
  const value = smooth(0, Curve.easeOutQuart);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(6.8359375);

  at(2);
  expect(value.get()).toBe(9.375);

  at(3);
  expect(value.get()).toBe(9.9609375);

  at(4);
  expect(value.get()).toBe(10);
});

test('smooth() should return a smooth value with easeInOutQuart curve', () => {
  const value = smooth(0, Curve.easeInOutQuart);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(0.3125);

  at(2);
  expect(value.get()).toBe(5);

  at(3);
  expect(value.get()).toBe(9.6875);

  at(4);
  expect(value.get()).toBe(10);
});

test('smooth() should return a smooth value with easeInQuint curve', () => {
  const value = smooth(0, Curve.easeInQuint);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(0.009765625);

  at(2);
  expect(value.get()).toBe(0.3125);

  at(3);
  expect(value.get()).toBe(2.373046875);

  at(4);
  expect(value.get()).toBe(10);
});

test('smooth() should return a smooth value with easeOutQuint curve', () => {
  const value = smooth(0, Curve.easeOutQuint);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(7.626953125);

  at(2);
  expect(value.get()).toBe(9.6875);

  at(3);
  expect(value.get()).toBe(9.990234375);

  at(4);
  expect(value.get()).toBe(10);
});

test('smooth() should return a smooth value with easeInOutQuint curve', () => {
  const value = smooth(0, Curve.easeInOutQuint);
  value.setTarget(10, 4);
  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(0.15625);

  at(2);
  expect(value.get()).toBe(5);

  at(3);
  expect(value.get()).toBe(9.84375);

  at(4);
  expect(value.get()).toBe(10);
});

test('SmoothValue#setCurve should set the default curve', () => {
  const value = smooth(0, Curve.easeInQuad);
  value.setCurve(Curve.linear);
  value.setTarget(10, 4);

  expect(value.get()).toBe(0);

  at(1);
  expect(value.get()).toBe(2.5);

  at(2);
  expect(value.get()).toBe(5);

  at(3);
  expect(value.get()).toBe(7.5);

  at(4);
  expect(value.get()).toBe(10);
});
