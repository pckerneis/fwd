import { resetScopes, scoped } from './api.scope.js';
import { cursor, wait } from './api.scheduler.js';
import { jest } from '@jest/globals';

beforeEach(() => {
  resetScopes();
});

test('scoped() should call action in a new scope', () => {
  const action = jest.fn();
  scoped(() => {
    wait(4);
    action(cursor());
  });
  expect(action).toHaveBeenCalledTimes(1);
  expect(action).toHaveBeenLastCalledWith(4);
  expect(cursor()).toBe(0);
});
