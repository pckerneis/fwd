export let DBG_MODE = false;

export function dbg(...msg) {
  if (DBG_MODE) {
    console.log(...msg);
  }
}
