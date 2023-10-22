/**
 * @typedef {Object} Stepper
 * @property {function} at - Trigger a stepper handler function at the given step
 */

/**
 * Creates a stepper object
 * @param {string} pattern - The pattern to play
 * @param {*} mapper - A dictionary mapping each step value to a handler function
 * @param {string} [continuation='~'] - The step continuation character
 * @returns {Stepper} the stepper object
 */
export function stepper(pattern, mapper, continuation = '~') {
  const lines = pattern.split('\n');
  const maxLineLength = Math.max(...lines.map((line) => line.length));

  const getSymbols = (index) => lines
    .map((line) => line[index % maxLineLength]);

  const getHandlers = (index) => getSymbols(index)
    .map((symbol) => mapper[symbol]);

  const getStepLength = (index, lineIndex) => {
    const line = lines[lineIndex];
    let length = 1;

    for (let i = index + 1; i < index + maxLineLength; i++) {
      const symbol = line[i % maxLineLength];

      if (symbol !== continuation) {
        break;
      } else {
        length++;
      }
    }

    return length;
  };

  return {
    at: (index) => {
      const handlers = getHandlers(index);

      handlers.forEach((handler) => {
        if (typeof handler === 'function') {
          const length = getStepLength(index, handlers.indexOf(handler));
          handler(length);
        }
      });
    },
  };
}
