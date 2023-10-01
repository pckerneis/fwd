import process from 'process';
import { clearBuffer } from './rli.js';
import { clock, isPaused } from './scheduler.js';
import { getLastChangeDate } from './vm.js';
import { getMidiSent, resetMidiSent } from './midi.js';

/**
 * Truncates an array so that it fits into terminal.
 *
 * @param {Array} textOutputLines an array of messages
 */
function truncateOutputLines(textOutputLines) {
  const maxLines = process.stdout.rows - 6;
  if (textOutputLines.length > maxLines) {
    textOutputLines.splice(0, textOutputLines.length - maxLines);
  }
}

/**
 * Clear the terminal and print a welcome header.
 *
 * @param {string} version
 */
export function printWelcome(version) {
  clearBuffer();
  console.log(`
 ▄▀▀ █ █ █ █▀▄
 █▀  ▀█▀█▀ █▄█
          v${version}
  `);
}

function toHHMMSS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const sec = seconds - minutes * 60 - hours * 3600;

  const hh = hours === 0 ? '00' : hours < 10 ? '0' + hours : hours;
  const mm = minutes === 0 ? '00' : minutes < 10 ? '0' + minutes : minutes;
  const ss =
    sec === 0 ? '00:000' : sec < 10 ? '0' + sec.toFixed(3) : sec.toFixed(3);
  return `${hh}:${mm}:${ss}`;
}

/**
 * Clear the terminal and print runner info.
 *
 * @param {string[]} outputLines an array of messages to be logged
 * @param {string} filePath path to current program file
 * @param {string} outputName MIDI output name
 * @param {boolean} headless - If true, header is hidden
 */
function drawOnce(outputLines, filePath, outputName, headless) {
  clearBuffer();
  truncateOutputLines(outputLines);

  const maxPathLength = process.stdout.columns - 21;
  const truncatedPath = filePath.substring(0, maxPathLength);
  const maxOutputLength = process.stdout.columns - 11;
  const truncatedOutput = outputName.substring(0, maxOutputLength);
  const lastChangeTime = getLastChangeDate()?.toLocaleTimeString() ?? 'never';

  const borderMargin = new Array(process.stdout.columns - 7).fill(' ').join('');

  const clockStrings = [];

  clockStrings.push(toHHMMSS(clock()));

  if (isPaused()) {
    clockStrings.push('[paused]');
  }

  if (headless) {
    console.log(outputLines.join('\n'));
  } else {
    console.log(
      `╔══${borderMargin}══╗
  in    ${truncatedPath} (at ${lastChangeTime})
  out   [${getMidiSent() ? 'x' : ' '}] ${truncatedOutput}
  time  ${clockStrings.join(' ')}
╚══${borderMargin}══╝
${outputLines.join('\n')}`,
    );
  }
}

/**
 * Start drawing runner info at fixed interval.
 *
 * @param {string} outputName MIDI output name
 * @param {string} file path to current program file
 * @param {string[]} outputLines an array of logged messages
 * @param {boolean} headless - If true, header is hidden
 */
export function startDisplay(outputName, file, outputLines, headless) {
  setInterval(() => {
    drawOnce(outputLines, file, outputName, headless);
    resetMidiSent();
  }, 100);

  process.stdout.on('resize', () =>
    drawOnce(outputLines, file, outputName, headless),
  );
}
