/**
 * @module MIDI
 */

import { dbg } from '../cli/dbg.js';
import { playNote, sendCC, sendProgramChange } from '../cli/midi.js';
import { _midiOutput } from './api.shared.js';
import { fire } from './api.scheduler.js';
import { getCurrentScope } from './api.scope.js';

const soloChannels = [];
const muteChannels = [];
const ALL_CHANNELS = Array.from({ length: 16 }, (_, i) => i);

export function getDefaultMidiChannel() {
  return getCurrentScope().midiChannel;
}

/**
 * Schedule a MIDI note to be played at the cursor position
 * with note number `pitch`, velocity `velocity` and duration `duration` on MIDI channel `channel`.
 *
 * @param {number} pitch - MIDI note number
 * @param {number} velocity - Velocity value
 * @param {number} [duration=1] - Note duration (defaults to 1)
 * @param {number} [channel] - MIDI channel to send to
 *
 * @example
 * // Play a MIDI note with note number 60, velocity 127 for 1 time unit on default channel
 * note(60, 127);
 *
 * // Play a MIDI note with note number 64, velocity 80 for 2 time units on channel 1
 * note(64, 80, 2, 1);
 */
export function note(pitch, velocity, duration = 1, channel) {
  channel = channel ?? getDefaultMidiChannel();

  fire(() => {
    dbg('About to play note');

    if (!isChannelActive(channel)) {
      return;
    }

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

  fire(() => {
    if (!isChannelActive(channel)) {
      return;
    }

    sendProgramChange(_midiOutput, program, channel);
  });
}

/**
 * Sends a MIDI continuous controller message.
 * @param {number} controller - MIDI program number
 * @param {number} value - new value
 * @param {number} [channel] - MIDI channel to send to
 */
export function cc(controller, value, channel) {
  channel = channel ?? getDefaultMidiChannel();

  fire(() => {
    if (!isChannelActive(channel)) {
      return;
    }

    sendCC(_midiOutput, controller, value, channel);
  });
}

/**
 * Set the default value for next MIDI messages
 * @param {number} [channelNumber] - Default MIDI channel
 *
 * @example
 * channel(9);
 *
 * // Play a MIDI note on channel 9
 * note(60, 127);
 */
export function channel(channelNumber) {
  getCurrentScope().midiChannel = channelNumber ?? 0;
}

/**
 * Mute one or more MIDI channels. If none are provided, all channels are muted.
 * @param {number} channelNumbers - MIDI channels to mute.
 *
 * @example
 * // Mute channel 1 and 2
 * mute(1, 2);
 */
export function mute(...channelNumbers) {
  fire(() => {
    if (channelNumbers.length === 0) {
      muteChannels.splice(0, muteChannels.length, ...ALL_CHANNELS);
      return;
    }

    channelNumbers.forEach((channelNumber) => {
      if (!muteChannels.includes(channelNumber)) {
        muteChannels.push(channelNumber);
      }
    });
  });
}

/**
 * Unmute one or more MIDI channels. If none are provided, all channels are unmuted.
 * @param {number} channelNumbers - MIDI channels to unmute
 */
export function unmute(...channelNumbers) {
  fire(() => {
    if (channelNumbers.length === 0) {
      muteChannels.splice(0, muteChannels.length);
      return;
    }

    channelNumbers.forEach((channelNumber) => {
      const index = muteChannels.indexOf(channelNumber);
      if (index >= 0) {
        muteChannels.splice(index, 1);
      }
    });
  });
}

/**
 * Solo one or more MIDI channels. If none are provided, all channels are soloed.
 * @param {number} channelNumbers - MIDI channels to solo
 */
export function solo(...channelNumbers) {
  fire(() => {
    if (channelNumbers.length === 0) {
      soloChannels.splice(0, soloChannels.length, ...ALL_CHANNELS);
      return;
    }

    channelNumbers.forEach((channelNumber) => {
      if (!soloChannels.includes(channelNumber)) {
        soloChannels.push(channelNumber);
      }
    });
  });
}

/**
 * Unsolo one or more MIDI channels. If none are provided, all channels are unsoloed.
 * @param {number} channelNumbers - MIDI channels to unsolo
 */
export function unsolo(...channelNumbers) {
  fire(() => {
    if (channelNumbers.length === 0) {
      soloChannels.splice(0, soloChannels.length);
      return;
    }

    channelNumbers.forEach((channelNumber) => {
      const index = soloChannels.indexOf(channelNumber);
      if (index >= 0) {
        soloChannels.splice(index, 1);
      }
    });
  });
}

function getActiveChannels() {
  if (soloChannels.length > 0) {
    return soloChannels;
  }

  if (muteChannels.length > 0) {
    return ALL_CHANNELS.filter((channel) => !muteChannels.includes(channel));
  }

  return ALL_CHANNELS;
}

function isChannelActive(channel) {
  return getActiveChannels().includes(channel);
}

export function resetMuteAndSolo() {
  muteChannels.splice(0, muteChannels.length);
  soloChannels.splice(0, soloChannels.length);
}

export function getSoloChannels() {
  return soloChannels;
}

export function getMuteChannels() {
  return muteChannels;
}
