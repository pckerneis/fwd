export let DBG_MODE = false;

export function setDebug(dbg) {
  DBG_MODE = dbg;
}

export function dbg(...msg) {
  if (DBG_MODE) {
    console.log(...msg);
  }
}
