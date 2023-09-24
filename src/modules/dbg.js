export let DBG_MODE = false;

/**
 * Enable or disable debug mode.
 * @param {boolean} dbg should debug mode be enabled
 */
export function setDebug(dbg) {
  DBG_MODE = dbg;
}

/**
 * Logs message to console if debug mode is enabled
 * @param {*} messages messages to log
 */
export function dbg(...messages) {
  if (DBG_MODE) {
    console.log(...messages);
  }
}
