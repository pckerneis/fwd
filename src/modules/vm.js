import vm from 'node:vm';
import { clearScheduledEvents } from './scheduler.js';
import { getApi, initApi } from './api.js';

let lastChangeDate;

export function getLastChangeDate() {
  return lastChangeDate;
}

function buildContext(midiOutput, textOutputLines, env) {
  initApi(midiOutput, textOutputLines, env);

  return {
    env,
    ...getApi(),
  };
}

export function runInSandbox(userCode, midiOutput, textOutputLines, env) {
  clearScheduledEvents();

  const context = buildContext(midiOutput, textOutputLines, env);

  try {
    vm.runInNewContext(userCode, context, { timeout: 10000 });
    lastChangeDate = new Date();
  } catch (e) {
    textOutputLines.push(e);
  }
}
