/**
 * @typedef {Object} Stepper
 * @property {function} get - Returns a stepper handler function at the given step
 * @property {function} at - Trigger a stepper handler function at the given step
 * @property {function} stepLength - Returns the length of the step at the given index
 */

/**
 * Creates a stepper object
 * @param {string|Array} pattern - The pattern to play
 * @param {*} mapper - A dictionary mapping each step value to a handler function
 * @param {string} [continuation='~'] - The step continuation character
 * @returns {Stepper} the stepper object
 */
export function stepper(pattern, mapper, continuation = '~') {
  const getHandler = (index) => {
    const step = pattern[index % pattern.length];
    const handler = mapper[step];

    if (!handler) {
      return null;
    }

    return handler;
  };

  const getStepLength = (index) => {
    let length = 1;

    for (let i = index + 1; i < index + pattern.length; i++) {
      const step = pattern[i % pattern.length];

      if (step !== continuation) {
        break;
      } else {
        length++;
      }
    }

    return length;
  };

  return {
    get: (index) => {
      return getHandler(index);
    },
    at: (index) => {
      const handler = getHandler(index);
      return handler ? handler(getStepLength(index)) : null;
    },
    stepLength: (index) => {
      return getStepLength(index);
    },
  };
}
