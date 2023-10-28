/**
 * @module Random
 */

import seedrandom from 'seedrandom';

let rng = seedrandom('hello, musch!');

/**
 * Sets the seed for the random number generator
 * @param {*} seed - the seed to use
 */
export function setSeed(seed) {
  rng = seedrandom(seed);
}

/**
 * Returns a random number between 0 and 1 with optional min and max values.
 * If both min and max are specified, the returned number will be between min and max.
 * If only min is specified, the returned number will be between 0 and min.
 *
 * @param {number} [min] - if both arguments are numbers, the minimum value of the random number,
 * else the maximum value
 * @param {number} [max] - if specified, the maximum value of the random number
 * @returns {number} a random number between 0 and 1
 */
export function random(min, max) {
  if (typeof min === 'number' && typeof max === 'number') {
    const actualMin = Math.min(min, max);
    const actualMax = Math.max(min, max);
    return actualMin + rng() * (actualMax - actualMin);
  } else if (typeof min === 'number') {
    return rng() * min;
  } else {
    return rng();
  }
}
