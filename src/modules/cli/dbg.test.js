import { jest } from '@jest/globals';
import { dbg, setDebug } from './dbg.js';

test('show debug messages on debug mode', () => {
  jest.spyOn(console, 'log');

  dbg('Hello, World!');
  expect(console.log).not.toHaveBeenCalled();

  setDebug(true);
  dbg('Hello, World!');
  expect(console.log).toHaveBeenCalled();
});
