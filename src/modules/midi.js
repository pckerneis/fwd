let midiSent = false;
let defaultMidiChannel = 0;

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
 *
 * @param {object} midiOutput the MIDI output to send signals to
 * @param {number} channel MIDI channel number (from 0 to 15)
 * @param {number} note MIDI note number
 * @param {number} velocity Note velocity
 * @param {number} duration Note duration in seconds
 */
export function playNote(midiOutput, channel, note, velocity, duration) {
  // dbg(`Playing MIDI note.`, { midiOutput, channel, note, velocity, duration });

  midiOutput.send('noteon', {
    note,
    velocity: velocity ?? 127,
    channel: channel ?? defaultMidiChannel,
  });

  setTimeout(() => {
    midiOutput.send('noteoff', {
      note,
      velocity: velocity ?? 127,
      channel: channel ?? defaultMidiChannel,
    });
  }, duration * 1000);

  notifyMidiSent();
}

export function sendProgramChange(midiOutput, programNumber, channel) {
  midiOutput.send('program', {
    number: programNumber,
    channel: channel ?? defaultMidiChannel,
  });
}

export function setDefaultMidiChannel(channelNumber) {
  defaultMidiChannel = channelNumber ?? 0;
}
