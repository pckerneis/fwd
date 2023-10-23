export let _midiOutput;
export let _logLines;
export let _persistedContext;

export function setMidiOutput(output) {
  _midiOutput = output;
}

export function setLogLines(logLines) {
  _logLines = logLines;
}

export function setPersistedContext(env) {
  _persistedContext = env;
}
