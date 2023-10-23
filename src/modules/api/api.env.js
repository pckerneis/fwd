import { _persistedContext } from './api.shared.js';

/**
 * Define variable in the execution context with an optional default value.
 * Returns a tuple with a getter and a setter for the variable.
 * @param {string} name - The accessor name
 * @param {*} [defaultValue] - An optional default value
 * @return {Array} A tuple with a getter and a setter
 */
export function define(name, defaultValue) {
  if (!Object.hasOwn(_persistedContext, name)) {
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
