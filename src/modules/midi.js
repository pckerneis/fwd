import easymidi from 'easymidi';

let midiSent = false;

/**
 * Notify that MIDI signal was sent
 */
function notifyMidiSent() {
  midiSent = true;
}

/**
 * Reset notifications about sent MIDI signal
 */
export function resetMidiSent() {
  midiSent = false;
}

/**
 * @returns true if MIDI signal was sent since last reset
 */
export function getMidiSent() {
  return midiSent;
}

/**
 * @returns an array with the available MIDI output names
 */
export function getOutputs() {
  return easymidi.getOutputs();
}

/**
 * Open a MIDI output
 * @param {string} outputName 
 * @returns 
 */
export function openMidiOutput(outputName) {
  return new easymidi.Output(outputName);
}

/**
 * 
 * @param {object} midiOutput the MIDI output to send signals to
 * @param {number} channel MIDI channel number (from 0 to 15)
 * @param {number} note MIDI note number
 * @param {number} velocity Note velocity
 * @param {duration} duration Note duration in seconds
 */
export function playNote(midiOutput, channel, note, velocity, duration) {
  midiOutput.send('noteon', {
    note,
    velocity: velocity ?? 127,
    channel: channel ?? 0,
  });

  setTimeout(() => {
    midiOutput.send('noteoff', {
      note,
      velocity: 0,
      channel: channel ?? 0,
    });
  }, duration * 1000);

  notifyMidiSent();
}
