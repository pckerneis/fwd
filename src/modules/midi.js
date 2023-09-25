let midiSent = false;
let defaultMidiChannel = 0;

let notesCurrentlyOnState = {};
let currentTriggerId = 0;

/**
 * Reset state for pending MIDI notes
 */
export function resetNotesCurrentlyOnState() {
  notesCurrentlyOnState = {};
  currentTriggerId = 0;
}

/**
 * Check if a note is currently playing
 * @param {number} channel - MIDI channel
 * @param {number} note - note number
 * @returns {boolean}
 */
function isNoteCurrentlyOn(channel, note) {
  return Boolean(notesCurrentlyOnState[channel]?.[note]);
}

/**
 * Get the trigger ID that started a note
 * @param {number} channel - MIDI channel
 * @param {number} note - note number
 * @returns {number} the trigger ID or undefined if note is not pending
 */
function getNoteTriggerId(channel, note) {
  return notesCurrentlyOnState[channel]?.[note]?.triggerId;
}

/**
 * Mark a note as pending with a trigger ID
 * @param {number} channel - MIDI channel
 * @param {number} note - note number
 * @param {number} triggerId - ID of the triggerer
 */
function setNoteCurrentlyOn(channel, note, triggerId) {
  if (notesCurrentlyOnState[channel] == null) {
    notesCurrentlyOnState[channel] = {};
  }

  notesCurrentlyOnState[channel][note] = { triggerId };
}

/**
 * Mark a note as not pending
 * @param {number} channel - MIDI channel
 * @param {number} note - note number
 */
function setNoteCurrentlyOff(channel, note) {
  if (notesCurrentlyOnState[channel] == null) {
    notesCurrentlyOnState[channel] = {};
  }

  notesCurrentlyOnState[channel][note] = null;
}

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
 * Send a note-on message. If a note is pending on the channel, send a note-off message first.
 * @param {number} channel - MIDI channel to send to
 * @param {number} note - MIDI note number
 * @param midiOutput - MIDI output to use
 * @param {number} velocity - Velocity value
 * @param {number} triggerId - Note trigger ID
 */
function sendNoteOnWithNoOverlap(
  channel,
  note,
  midiOutput,
  velocity,
  triggerId,
) {
  sendNoteOffIfCurrentlyOn(channel, note, midiOutput);

  midiOutput.send('noteon', { note, velocity, channel });
  setNoteCurrentlyOn(channel, note, triggerId);
  notifyMidiSent();
}

/**
 * Sends note off message if note is pending
 * @param {number} channel - the channel
 * @param {number} note - the note number
 * @param {*} midiOutput - the MIDI output to use
 */
function sendNoteOffIfCurrentlyOn(channel, note, midiOutput) {
  if (isNoteCurrentlyOn(channel, note)) {
    midiOutput.send('noteoff', { note, velocity: 0, channel });
    setNoteCurrentlyOff(channel, note);
    notifyMidiSent();
  }
}

/**
 * Sends note off message if note was started with a given trigger ID
 * @param {number} channel - the channel
 * @param {number} note - the note number
 * @param {*} midiOutput - the MIDI output to use
 * @param {number} triggerId - the trigger ID to test
 */
function sendNoteOffIfTriggerIdMatches(channel, note, midiOutput, triggerId) {
  if (getNoteTriggerId(channel, note) === triggerId) {
    midiOutput.send('noteoff', { note, velocity: 0, channel });
    setNoteCurrentlyOff(channel, note);
    notifyMidiSent();
  }
}

/**
 * Send a note-on and a note-off messages.
 * @param {object} midiOutput - the MIDI output to send signals to
 * @param {number} channel - MIDI channel number (from 0 to 15)
 * @param {number} note - MIDI note number
 * @param {number} velocity - Note velocity
 * @param {number} duration - Note duration in seconds
 */
export function playNote(midiOutput, channel, note, velocity, duration) {
  const triggerId = currentTriggerId++;
  channel = channel ?? defaultMidiChannel;
  velocity = velocity ?? 127;

  sendNoteOnWithNoOverlap(channel, note, midiOutput, velocity, triggerId);

  setTimeout(() => {
    sendNoteOffIfTriggerIdMatches(channel, note, midiOutput, triggerId);
  }, duration * 1000);
}

/**
 * Send a program change message
 * @param {*} midiOutput - MIDI output to send to
 * @param {number} programNumber - MIDI program number
 * @param {number} channel - MIDI channel to send to
 */
export function sendProgramChange(midiOutput, programNumber, channel) {
  midiOutput.send('program', {
    number: programNumber,
    channel: channel ?? defaultMidiChannel,
  });
}

/**
 * Set the default value for next MIDI messages
 * @param {number} channelNumber - Default MIDI channel
 */
export function setDefaultMidiChannel(channelNumber) {
  defaultMidiChannel = channelNumber ?? 0;
}
