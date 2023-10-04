import { rli } from './rli.js';
import { tryToReadFile } from './file.js';

/**
 * Prompts the user for a MIDI output
 * @param {string[]} outputs list of available MIDI output names
 * @returns output chosen by user
 */
async function promptMatchingOutput(outputs) {
  do {
    const answer = await rli.question(`
Available MIDI outputs:
- ${outputs.join('\n- ')}

Which MIDI output do you want to use? `);

    const matches = getBestMatches(answer, outputs);

    if (matches.length === 0) {
      console.warn(`\nNo MIDI output matches "${answer}".`);
    } else if (matches.length > 1) {
      console.warn(
        `\n"${answer}" could match the following outputs : ${matches.join(
          ', ',
        )}.`,
      );
    } else {
      return matches[0];
    }
  } while (true);
}

/**
 * Find options matching user-provided input
 * @param {string} candidate user-provided input
 * @param {string[]} options array of valid options
 * @returns {string[]} a list of matching valid options
 */
export function getBestMatches(candidate, options) {
  const lowerCaseCandidate = candidate.toLocaleLowerCase();
  return options.filter((out) =>
    out.toLocaleLowerCase().startsWith(lowerCaseCandidate),
  );
}

/**
 * Prompts the user for a MIDI output if there are more than one available.
 * Log a warning if there are no MIDI output available, and return null.
 * @param {string[]} outputs available MIDI output names
 * @returns a MIDI output chosen by user
 */
export async function promptMidiOutputName(outputs) {
  let midiOut = null;

  if (outputs.length === 0) {
    console.warn('No MIDI output available. Exiting.');
    return null;
  }

  if (outputs.length === 1) {
    midiOut = outputs[0];
  } else {
    midiOut = await promptMatchingOutput(outputs);
  }

  return midiOut;
}

/**
 * Prompts an existing program file
 * @param {string} filePath optional file path to check first
 * @returns {Promise<{path: string, content: string}>} file chosen by user
 */
export async function promptAndReadFile(filePath) {
  const existingFile = await tryToReadFile(filePath);

  if (existingFile != null) {
    return existingFile;
  } else {
    return await promptFile();
  }
}

/**
 * Asks the user to chose a file to run. This function gets recursively called
 * until an readable file is found.
 * @returns an existing file
 */
async function promptFile() {
  const answer = await rli.question(`What file to run? `);
  const existingFile = await tryToReadFile(answer);

  if (existingFile) {
    console.info(`\nReading from "${existingFile.path}".`);

    return existingFile;
  } else {
    console.warn(`\nCannot read "${answer}".\n`);

    return await promptFile();
  }
}
