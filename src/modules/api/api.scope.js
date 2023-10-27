/**
 * @module Scope
 * @ignore
 */

/**
 * @typedef SchedulingScope
 * @property {number} cursor - scheduling cursor
 * @property {number} midiChannel - default MIDI channel
 */

/**
 * The scopes stack
 * @type {SchedulingScope[]}
 */
let scopes = [getDefaultScope()];

/**
 * Creates default scope
 * @return {SchedulingScope}
 */
function getDefaultScope() {
  return {
    cursor: 0,
    midiChannel: 0,
  };
}

/**
 * Reset the stack with default scope
 */
export function resetScopes() {
  scopes = [getDefaultScope()];
}

/**
 * Push a scope on stack
 * @param {SchedulingScope} scope - scope to add on top of stack
 */
export function pushScope(scope) {
  scopes.push(scope);
}

/**
 * Remove and return top of stack
 * @return {SchedulingScope}
 */
export function popScope() {
  return scopes.pop();
}

/**
 * Return top of stack
 * @return {SchedulingScope}
 */
export function getCurrentScope() {
  return scopes[scopes.length - 1];
}
