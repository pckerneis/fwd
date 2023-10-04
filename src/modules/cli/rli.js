import { createInterface } from 'node:readline/promises';
import { cursorTo, clearScreenDown } from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

/**
 * NodeJS's readline interface using stdin and stdout
 */
export const rli = createInterface({ input, output });

/**
 * Clears the terminal
 */
export function clearBuffer() {
  cursorTo(output, 0, 0);
  clearScreenDown(output);
}
