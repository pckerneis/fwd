/**
 * @module Random
 */

import seedrandom from 'seedrandom';

let rng = seedrandom('hello, musch!');

/**
 * Sets the seed for the random number generator.
 * Setting the seed to the same value will result in the same sequence of random numbers.
 * @param {*} seed - the seed to use
 *
 * @example
 * setSeed('hello, musch!');
 * random(); // 0.6235711870582765
 * random(); // 0.6597003782594609
 *
 * setSeed('hello, musch!');
 * random(); // 0.6235711870582765
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
 *
 * @example
 * random(); // 0.6597003782594609
 * random(10); // 6.419559847089204
 * random(10, 20); // 15.731895383250938
 * random(10, 10); // 10
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
