import { clearBuffer } from './rli.js';
import { now } from './scheduler.js';
import { getLastChangeDate } from './vm.js';
import { getMidiSent, resetMidiSent } from './midi-sent.js';

function truncateOutputLines(outlines) {
  const maxLines = 10;
  if (outlines.length > maxLines) {
    outlines.splice(0, outlines.length - maxLines);
  }
}

export function startDisplay(existingOutput, existingFile, outlines) {
  setInterval(() => {
    clearBuffer();
    truncateOutputLines(outlines);

    console.log(
      `Output: [${getMidiSent() ? 'x' : ' '}] ${existingOutput}
File:   ${existingFile.path} (at ${getLastChangeDate().toLocaleTimeString()})
Time:   ${now()}
____________________________________
${outlines.join('\n')}`,
    );

    resetMidiSent();
  }, 100);
}
