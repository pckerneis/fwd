/**
 * Pick an element among choices.
 * - If an array is provided, the output will be an element of the array
 * - If an string is provided, the output will be a character of the string
 * - If a number is provided, the output will be a number between 0 and this number
 * - For other inputs, the output is a random value between 0 and 1
 *
 * @param {Array} [numberOrArrayOrElements] - choices to pick from as a number, an array or a string
 * @returns {*} a randomly picked element
 */
export function pick(...numberOrArrayOrElements) {
  const value = Math.random();

  if (numberOrArrayOrElements?.length === 0) {
    return value;
  } else if (numberOrArrayOrElements?.length > 1) {
    const index = Math.floor(value * numberOrArrayOrElements.length);
    return numberOrArrayOrElements[index];
  } else {
    const numberOrArray = numberOrArrayOrElements[0];
    if (Array.isArray(numberOrArray) || typeof numberOrArray === 'string') {
      return numberOrArray[Math.floor(value * numberOrArray.length)];
    } else if (typeof numberOrArray === 'number') {
      return value * numberOrArray;
    } else {
      return value;
    }
  }
}

/**
 * For each element of `iterableOrNumber`, call a function `callback`.
 * It can iterate over an iterable (such as an Array or a string) or on positive
 * integers starting from zero.
 * @param iterableOrNumber
 * @param callback
 */
export function iter(iterableOrNumber, callback) {
  if (typeof iterableOrNumber === 'number') {
    for (let i = 0; i < Math.abs(iterableOrNumber); i++) {
      callback(i);
    }
  } else if (typeof iterableOrNumber?.[Symbol.iterator]) {
    let i = 0;
    for (let e of iterableOrNumber) {
      callback(e, i++);
    }
  } else {
    callback(iterableOrNumber);
  }
}

/**
 * @typedef Ring
 *
 * A Ring (or circular buffer) acts like a list whose end is connected to its start.
 * Call `next()` to get next element in list, or `peek()` to read the current element.
 *
 * @property {Function} get - return an element at given position.
 * @property {Function} move - moves cursor at given position and return the pointed element
 * @property {Function} next - advance cursor and return the next element of the Ring.
 * @property {Function} peek - return the currently pointed element of the Ring.
 */

/**
 * Creates a Ring.
 *
 * @param {...*} elements - Elements to circle through
 * @return {Ring} a Ring containing `elements`.
 */
export function ring(...elements) {
  let index = -1;

  const get = (i) => elements[i % elements.length];

  const move = (i) => {
    index = i;
    return get(index);
  };

  const next = () => get(++index);
  const peek = () => get(index);

  return {
    get,
    move,
    next,
    peek,
  };
}
