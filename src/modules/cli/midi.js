import { getSchedulerSpeed } from './scheduler.js';

let midiSent = [];
let notesCurrentlyOnState = {};
let currentTriggerId = 0;

export function getChannelVisualizationData() {
  let result = [];
  for (let c = 0; c < 16; ++c) {
    let maxVelocity = 0;

    if (notesCurrentlyOnState[c]) {
      for (let n = 0; n < 128; ++n) {
        if (notesCurrentlyOnState[c][n]) {
          maxVelocity = Math.max(
            maxVelocity,
            notesCurrentlyOnState[c][n].velocity,
          );
        }
      }
    }

    result.push(maxVelocity);
  }

  return result;
}

function notifyMidiSent(channel) {
  if (!midiSent.includes(channel)) midiSent.push(channel);
}

export function resetMidiSent() {
  midiSent = [];
}

export function getMidiSent() {
  return midiSent;
}

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
 * @param {number} velocity - note velocity
 * @param {number} triggerId - ID of the triggerer
 */
function setNoteCurrentlyOn(channel, note, velocity, triggerId) {
  if (notesCurrentlyOnState[channel] == null) {
    notesCurrentlyOnState[channel] = {};
  }

  notesCurrentlyOnState[channel][note] = { triggerId, velocity };
}

/**
 * Mark a note as not pending
 * @param {number} channel - MIDI channel
 * @param {number} note - note number
 */
function setNoteCurrentlyOff(channel, note) {
  if (notesCurrentlyOnState[channel]) {
    notesCurrentlyOnState[channel][note] = null;
  }
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
  setNoteCurrentlyOn(channel, note, velocity, triggerId);
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
  note = Math.floor(note);
  channel = Math.floor(channel);
  velocity = Math.floor(velocity);

  if (
    isOutOfRange(note, 0, 127) ||
    isOutOfRange(velocity, 0, 127) ||
    isOutOfRange(channel, 0, 15)
  ) {
    return;
  }

  sendNoteOnWithNoOverlap(channel, note, midiOutput, velocity, triggerId);

  setTimeout(
    () => {
      sendNoteOffIfTriggerIdMatches(channel, note, midiOutput, triggerId);
    },
    (duration * 1000) / getSchedulerSpeed(),
  );
}

/**
 * Send a program change message
 * @param {*} midiOutput - MIDI output to send to
 * @param {number} programNumber - MIDI program number
 * @param {number} [channel=0] - MIDI channel to send to
 */
export function sendProgramChange(midiOutput, programNumber, channel) {
  if (isOutOfRange(programNumber, 0, 127) || isOutOfRange(channel, 0, 15)) {
    return;
  }

  midiOutput.send('program', {
    number: Math.floor(programNumber),
    channel: Math.floor(channel),
  });

  notifyMidiSent(channel);
}
/**
 * Send a continuous controller change message
 * @param {*} midiOutput - MIDI output to send to
 * @param {number} controllerNumber - MIDI program number
 * @param {number} value - new value
 * @param {number} [channel=0] - MIDI channel to send to
 */
export function sendCC(midiOutput, controllerNumber, value, channel) {
  if (
    isOutOfRange(controllerNumber, 0, 127) ||
    isOutOfRange(value, 0, 127) ||
    isOutOfRange(channel, 0, 15)
  ) {
    return;
  }

  midiOutput.send('cc', {
    controller: Math.floor(controllerNumber),
    channel: Math.floor(channel),
    value: Math.floor(value),
  });

  notifyMidiSent(channel);
}

function isOutOfRange(v, min, max) {
  return typeof v !== 'number' || v < min || v > max;
}
