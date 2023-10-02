import process from 'process';
import { clearBuffer } from './rli.js';
import { clock, isPaused } from './scheduler.js';
import { getLastChangeDate } from './vm.js';
import {
  getChannelVisualizationData,
  getMidiSent,
  resetMidiSent,
} from './midi.js';
import chalk from 'chalk';

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

const velocitySymbols = [
  chalk.gray('\u2581'),
  chalk.blue('\u2582'),
  chalk.blue('\u2583'),
  chalk.blue('\u2584'),
  chalk.blue('\u2585'),
  chalk.blue('\u2586'),
  chalk.blue('\u2587'),
  chalk.blue('\u2588'),
];

function buildMidiVisualization() {
  const midiSent = getMidiSent();
  resetMidiSent();

  return getChannelVisualizationData()
    .map((maxVelocity, channel) => {
      const hasNonNoteSignal = midiSent.includes(channel);
      const symbol =
        velocitySymbols[
          Math.floor((velocitySymbols.length * maxVelocity) / 128)
        ];
      const coloredSymbol =
        maxVelocity > 0 ? chalk.blue(symbol) : chalk.gray(symbol);
      return hasNonNoteSignal ? chalk.bgRed(coloredSymbol) : coloredSymbol;
    })
    .join('');
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
  let lastChangeTime = getLastChangeDate()?.toLocaleTimeString() ?? 'never';

  if (Date.now() - getLastChangeDate().getTime() < 1500) {
    lastChangeTime = chalk.red(lastChangeTime);
  }

  const borderMargin = new Array(process.stdout.columns - 7).fill(' ').join('');
  const midiOutStr = buildMidiVisualization();

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
  out   [${midiOutStr}] ${truncatedOutput}
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
  }, 100);

  process.stdout.on('resize', () =>
    drawOnce(outputLines, file, outputName, headless),
  );
}
