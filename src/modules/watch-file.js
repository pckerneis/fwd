import chokidar from 'chokidar';

export async function watchFile(path, callback) {
  chokidar.watch(path).on('change', () => callback());
}
