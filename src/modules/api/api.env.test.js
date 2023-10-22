import { _env, setEnv } from './api.shared.js';
import { define, set } from './api.env.js';

beforeEach(() => {
  setEnv({});
});

test('def() adds to context', () => {
  const variable = define('fortyTwo', 42);
  expect(variable).toBe(42);
  expect(_env.fortyTwo).toBe(42);
});

test('def() does not overwrite', () => {
  define('fortyTwo', 42);
  const variable = define('fortyTwo', 48);
  expect(variable).toBe(42);
  expect(_env.fortyTwo).toBe(42);
});

test('set() overwrite variable', () => {
  set('fortyTwo', 48);
  expect(_env.fortyTwo).toBe(48);
});
