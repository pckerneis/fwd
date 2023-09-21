import easymidi from 'easymidi';

let midiSent = false;

function notifyMidiSent() {
  midiSent = true;
}

export function resetMidiSent() {
  midiSent = false;
}

export function getMidiSent() {
  return midiSent;
}

export function getOutputs() {
  return easymidi.getOutputs();
}

export function openMidiOutput(outputName) {
  return new easymidi.Output(outputName);
}

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
