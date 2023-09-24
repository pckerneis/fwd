let midiSent = false;
let defaultMidiChannel = 0;

let notesCurrentlyOnState = {};
let currentTriggerId = 0;

export function resetNotesCurrentlyOnState() {
  notesCurrentlyOnState = {};
}

function isNoteCurrentlyOn(channel, note) {
  return Boolean(notesCurrentlyOnState[channel]?.[note]);
}

function getNoteTriggerId(channel, note) {
  return notesCurrentlyOnState[channel]?.[note]?.triggerId;
}

function setNoteCurrentlyOn(channel, note, triggerId) {
  if (notesCurrentlyOnState[channel] == null) {
    notesCurrentlyOnState[channel] = {};
  }

  notesCurrentlyOnState[channel][note] = { triggerId };
}

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

function sendNoteOnWithNoOverlap(
  channel,
  note,
  midiOutput,
  velocity,
  triggerId,
) {
  sendNoteOffIfCurrentlyOn();

  midiOutput.send('noteon', { note, velocity, channel });
  setNoteCurrentlyOn(channel, note, triggerId);
  notifyMidiSent();
}

function sendNoteOffIfCurrentlyOn(channel, note, midiOutput, velocity) {
  if (isNoteCurrentlyOn(channel, note)) {
    midiOutput.send('noteoff', { note, velocity, channel });
    setNoteCurrentlyOff(channel, note);
    notifyMidiSent();
  }
}

function sendNoteOffIfTriggerIdMatches(
  channel,
  note,
  midiOutput,
  velocity,
  triggerId,
) {
  if (getNoteTriggerId(channel, note) === triggerId) {
    midiOutput.send('noteoff', { note, velocity, channel });
    setNoteCurrentlyOff(channel, note);
    notifyMidiSent();
  }
}

/**
 * Send a note-on and a note-off messages.
 * @param {object} midiOutput the MIDI output to send signals to
 * @param {number} channel MIDI channel number (from 0 to 15)
 * @param {number} note MIDI note number
 * @param {number} velocity Note velocity
 * @param {number} duration Note duration in seconds
 */
export function playNote(midiOutput, channel, note, velocity, duration) {
  const triggerId = currentTriggerId++;
  channel = channel ?? defaultMidiChannel;
  velocity = velocity ?? 127;

  sendNoteOnWithNoOverlap(channel, note, midiOutput, velocity, triggerId);

  setTimeout(() => {
    sendNoteOffIfTriggerIdMatches(
      channel,
      note,
      midiOutput,
      velocity,
      triggerId,
    );
  }, duration * 1000);
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
