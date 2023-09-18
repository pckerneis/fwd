import easymidi from 'easymidi';

export function getOutputs() {
  return easymidi.getOutputs();
}

export function openMidiOutput(outputName) {
  return new easymidi.Output(outputName);
}

export function playNote(options) {
  const { midiOutput, note, velocity, channel, duration, time } = options;

  setTimeout(() => {
    midiOutput.send('noteon', {
      note,
      velocity: velocity ?? 127,
      channel: channel ?? 0,
    });
  }, time);

  setTimeout(() => {
    midiOutput.send('noteoff', {
      note,
      velocity: 0,
      channel: channel ?? 0,
    });
  }, time + duration);
}
