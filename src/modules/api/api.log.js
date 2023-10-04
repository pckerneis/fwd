import { _logLines } from './api.shared.js';
import { fire } from './api.scheduler.js';

/**
 * Clears the logs.
 */
export function clear() {
  _logLines.splice(0, _logLines.length);
}

/**
 * Schedule a log clear at the cursor position.
 */
export function fclear() {
  fire(() => clear());
}

/**
 * Log messages tout console output.
 *
 * @param {*} messages - Messages to log
 */
export function log(...messages) {
  _logLines.push(...messages);
}

/**
 * Schedule messages to be logged at the cursor position.
 *
 * @param {*} messages - Messages to log
 */
export function flog(...messages) {
  fire(() => log(...messages));
}
