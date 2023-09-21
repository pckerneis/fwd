import process from 'process';
import { clearBuffer } from './rli.js';
import { now } from './scheduler.js';
import { getLastChangeDate } from './vm.js';
import { getMidiSent, resetMidiSent } from './midi.js';

function truncateOutputLines(outlines) {
  const maxLines = process.stdout.rows - 6;
  if (outlines.length > maxLines) {
    outlines.splice(0, outlines.length - maxLines);
  }
}

export function printWelcome(version) {
  clearBuffer();
  console.log(`
 ▄▀▀ █ █ █ █▀▄
 █▀  ▀█▀█▀ █▄█
          v${version}
  `);
}

function drawOnce(outputLines, file, outputName) {
  clearBuffer();
  truncateOutputLines(outputLines);

  const maxPathLength = process.stdout.columns - 20;
  const truncatedPath = file.path.substring(0, maxPathLength);
  const maxOutputLength = process.stdout.columns - 10;
  const truncatedOutput = outputName.substring(0, maxOutputLength);

  const borderMargin = new Array(process.stdout.columns - 7).fill(' ').join('');

  console.log(
    `╔══${borderMargin}══╗
 in    ${truncatedPath} (at ${getLastChangeDate().toLocaleTimeString()})
 out   [${getMidiSent() ? 'x' : ' '}] ${truncatedOutput}
 time  ${now()}
╚══${borderMargin}══╝
${outputLines.join('\n')}`,
  );
}

export function startDisplay(outputName, file, outputLines) {
  setInterval(() => {
    drawOnce(outputLines, file, outputName);
    resetMidiSent();
  }, 100);

  process.stdout.on('resize', () => drawOnce(outputLines, file, outputName));
}
