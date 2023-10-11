import { dbg } from '../cli/dbg.js';
import { playNote, sendCC, sendProgramChange } from '../cli/midi.js';
import { _midiOutput } from './api.shared.js';
import { fire } from './api.scheduler.js';
import { getCurrentScope } from './api.scope.js';

export function getDefaultMidiChannel() {
  return getCurrentScope().midiChannel;
}

/**
 * Schedule a MIDI note to be played at the cursor position
 * with note number `pitch`, velocity `velocity` and duration `duration` on MIDI channel `channel`.
 *
 * @param {number} pitch - MIDI note number
 * @param {number} velocity - Velocity value
 * @param {number} duration - Note duration
 * @param {number} [channel] - MIDI channel to send to
 */
export function note(pitch, velocity, duration, channel) {
  channel = channel ?? getDefaultMidiChannel();

  fire(() => {
    dbg('About to play note');
    playNote(_midiOutput, channel, pitch, velocity, duration);
  });
}

/**
 * Sends a MIDI program change message.
 * @param {number} program - MIDI program number
 * @param {number} [channel] - MIDI channel to send to
 */
export function program(program, channel) {
  channel = channel ?? getDefaultMidiChannel();

  fire(() => sendProgramChange(_midiOutput, program, channel));
}

/**
 * Sends a MIDI continuous controller message.
 * @param {number} controller - MIDI program number
 * @param {number} value - new value
 * @param {number} [channel] - MIDI channel to send to
 */
export function cc(controller, value, channel) {
  channel = channel ?? getDefaultMidiChannel();

  fire(() => sendCC(_midiOutput, controller, value, channel));
}

/**
 * Set the default value for next MIDI messages
 * @param {number} [channelNumber] - Default MIDI channel
 */
export function channel(channelNumber) {
  getCurrentScope().midiChannel = channelNumber ?? 0;
}
