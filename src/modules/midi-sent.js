let midiSent = false;

export function notifyMidiSent() {
  midiSent = true;
}

export function resetMidiSent() {
  midiSent = false;
}

export function getMidiSent() {
  return midiSent;
}
