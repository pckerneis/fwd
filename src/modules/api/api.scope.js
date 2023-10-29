/**
 * @module Scope
 */

/**
 * @ignore
 * @typedef SchedulingScope
 * @property {number} cursor - scheduling cursor
 * @property {number} midiChannel - default MIDI channel
 */

/**
 * @ignore
 * The scopes stack
 * @type {SchedulingScope[]}
 */
let scopes = [getDefaultScope()];

/**
 * @ignore
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
 * @ignore
 * Reset the stack with default scope
 */
export function resetScopes() {
  scopes = [getDefaultScope()];
}

/**
 * @ignore
 * Push a scope on stack
 * @param {SchedulingScope} scope - scope to add on top of stack
 */
export function pushScope(scope) {
  scopes.push(scope);
}

/**
 * @ignore
 * Remove and return top of stack
 * @return {SchedulingScope}
 */
export function popScope() {
  return scopes.pop();
}

/**
 * @ignore
 * Return top of stack
 * @return {SchedulingScope}
 */
export function getCurrentScope() {
  return scopes[scopes.length - 1];
}

/**
 * Call `action` in a new scope. The new scope is a copy of the current scope. The current scope is not modified.
 *
 * @example
 * scoped(() => {
 *   wait(4);
 *   cursor(); // 4
 * });
 * cursor(); // 0
 * @param action - action to call
 */
export function scoped(action) {
  const scope = getCurrentScope();
  pushScope({ ...scope });
  action();
  popScope();
}
