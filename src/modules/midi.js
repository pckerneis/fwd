import easymidi from 'easymidi';

export function getOutputs() {
  return easymidi.getOutputs();
}

export function openMidiOutput(outputName) {
  return new easymidi.Output(outputName);
}

export function playNote(midiOutput, channel, note, velocity, time, duration) {
  setTimeout(() => {
    midiOutput.send('noteon', {
      note,
      velocity: velocity ?? 127,
      channel: channel ?? 0,
    });
  }, time * 1000);

  setTimeout(
    () => {
      midiOutput.send('noteoff', {
        note,
        velocity: 0,
        channel: channel ?? 0,
      });
    },
    (time + duration) * 1000,
  );
}
