import * as fs from 'node:fs/promises';
import * as path from 'path';
import process from 'process';

/**
 * Tries to read a file given a path
 * @param {string} relativeOrAbsolutePath path to file
 * @returns {{path: string, content: string}} the loaded file or null
 */
export async function tryToReadFile(relativeOrAbsolutePath) {
  if (!relativeOrAbsolutePath) {
    return null;
  }

  try {
    return {
      path: relativeOrAbsolutePath,
      content: await fs.readFile(relativeOrAbsolutePath, 'utf8'),
    };
  } catch (e) {
    try {
      const fullPath = path.resolve(process.cwd(), relativeOrAbsolutePath);
      return {
        path: fullPath,
        content: await fs.readFile(fullPath, 'utf8'),
      };
    } catch (e2) {
      return null;
    }
  }
}
