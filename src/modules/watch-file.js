import fs from 'node:fs/promises';

export async function watchFile(path, callback) {
  const ac = new AbortController();
  const { signal } = ac;
  setTimeout(() => ac.abort(), 10000);

  try {
    const watcher = fs.watch(path, { signal });
    for await (const event of watcher) {
      callback();
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      return;
    }

    throw err;
  }
}
