import { rli } from './rli.js';
import { tryToReadFile } from './file.js';

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

export function getBestMatches(candidate, options) {
  const lowerCaseCandidate = candidate.toLocaleLowerCase();
  return options.filter((out) =>
    out.toLocaleLowerCase().startsWith(lowerCaseCandidate),
  );
}

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

export async function promptAndReadFile(filePath) {
  const existingFile = await tryToReadFile(filePath);

  if (existingFile != null) {
    return existingFile;
  } else {
    return await promptFile();
  }
}

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
