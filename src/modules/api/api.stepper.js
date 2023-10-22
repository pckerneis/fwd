/**
 * @typedef {Object} Stepper
 * @property {function} at - Trigger a stepper handler function at the given step
 */

function removeWhitespaces(line) {
  return line.replace(/\s/g, '');
}

/**
 * Creates a stepper object
 * @param {string} pattern - The pattern to play
 * @param {*} mapper - A dictionary mapping each step value to a handler function
 * @param {string} [continuation='~'] - The step continuation character
 * @returns {Stepper} the stepper object
 */
export function stepper(pattern, mapper, continuation = '~') {
  const lines = pattern.split('\n')
    .map((line) => removeWhitespaces(line));

  const maxLineLength = Math.max(...lines.map((line) => line.length));

  const getSymbols = (index) => lines
    .map((line) => line[index % maxLineLength]);

  const getHandlers = (index) => getSymbols(index)
    .map((symbol) => mapper[symbol]);

  const getStepDuration = (index, lineIndex) => {
    const line = lines[lineIndex];
    let duration = 1;

    for (let i = index + 1; i < index + maxLineLength; i++) {
      const symbol = line[i % maxLineLength];

      if (symbol !== continuation) {
        break;
      } else {
        duration++;
      }
    }

    return duration;
  };

  return {
    at: (index) => {
      const handlers = getHandlers(index);

      handlers.forEach((handler, handlerIndex) => {
        if (typeof handler === 'function') {
          const duration = getStepDuration(index, handlerIndex);
          const symbol = getSymbols(index)[handlerIndex];
          const line = handlerIndex;
          handler({duration, symbol, line});
        }
      });
    },
  };
}
