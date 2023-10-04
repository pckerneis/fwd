import { _env } from './api.shared.js';

/**
 * Define variable in the execution context with an optional default value.
 * This won't have any effects if a value is already defined for `name`.
 * @param {string} name - The accessor name
 * @param {*} [defaultValue] - A default value
 * @return {*} the named value
 */
export function define(name, defaultValue) {
  if (_env.defaultValue === undefined) {
    _env[name] = defaultValue;
  }

  return _env[name];
}

/**
 * Define or overwrite variable in the execution context with the provided value.
 * This won't have any effects if a value is already defined for `name`.
 * @param {string} name - The accessor name
 * @param {*} value - new value
 */
export function set(name, value) {
  _env[name] = value;
}
