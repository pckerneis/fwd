import { createInterface } from 'node:readline/promises';
import { cursorTo, clearScreenDown } from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

export const rli = createInterface({ input, output });

export function clearBuffer() {
  cursorTo(output, 0, 0);
  clearScreenDown(output);
}
