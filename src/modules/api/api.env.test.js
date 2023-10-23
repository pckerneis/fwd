import { setPersistedContext } from './api.shared.js';
import { define, undefine } from './api.env.js';

beforeEach(() => {
  setPersistedContext({});
});

test('define() returns a getter and a setter for a named value', () => {
  const [get, set] = define('fortyTwo');
  expect(get()).toBe(undefined);

  expect(set('foo')).toBe('foo');
  expect(get()).toBe('foo');
});

test('define() sets a default value', () => {
  const [get] = define('fortyTwo', 'foo');
  expect(get()).toBe('foo');
});

test('define() does not overwrite with the default value when called a second time', () => {
  define('fortyTwo', 'foo');

  const [get] = define('fortyTwo', 'bar');
  expect(get()).toBe('foo');
});

test('define() provides handles to the same value', () => {
  const [get1, set1] = define('fortyTwo', 'foo');
  const [get2] = define('fortyTwo', 'bar');

  expect(get1()).toBe(get2());
  set1('baz');

  expect(get1()).toBe('baz');
  expect(get1()).toBe(get2());
});

test('undefine() deletes a named value', () => {
  const [get] = define('fortyTwo', 'foo');

  undefine('fortyTwo');
  expect(get()).toBe(undefined);
});
