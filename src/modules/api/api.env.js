import { _persistedContext } from './api.shared.js';

/**
 * Define a variable with an optional default value. Once defined, the variable can be accessed and changed with
 * the returned getter and setter functions. The set value is persisted across executions.
 *
 * @example
 * const [getFoo, setFoo] = define('foo');
 * setFoo('bar');
 * getFoo(); // returns 'bar'
 *
 * @param {string} name - The accessor name
 * @param {*} [defaultValue] - An optional default value
 * @return {Array} A tuple with a getter and a setter
 */
export function define(name, defaultValue) {
  if (!Object.prototype.hasOwnProperty.call(_persistedContext, name)) {
    _persistedContext[name] = defaultValue;
  }

  return [
    () => _persistedContext[name],
    (value) => (_persistedContext[name] = value),
  ];
}

/**
 * Delete a variable from the execution context.
 * @param {string} name - The accessor name
 */
export function undefine(name) {
  delete _persistedContext[name];
}
