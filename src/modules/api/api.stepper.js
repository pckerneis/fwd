/**
 * @typedef {Object} Stepper
 * @property {function} at - Calls the handler function for the given step index
 */

/**
 * @typedef {Object} Step
 * @property {number} duration - The duration of the step
 * @property {string} symbol - The symbol of the step
 * @property {number} line - The line of the step
 */

/**
 * @callback StepperHandler
 * @param {Step} step - The step object
 */

/**
 * @ignore
 * Removes whitespaces from a string
 * @param {string} line - The string to remove whitespaces from
 * @returns {string} the string without whitespaces
 */
function removeWhitespaces(line) {
  return line.replace(/\s/g, '');
}

/**
 * Creates a stepper object
 * @param {string} pattern - The pattern to play
 * @param {StepperHandler} handler - A function to be called for each step
 * @param {string} [continuation='~'] - The step continuation character
 * @param {string} [silence='_'] - The step silence character
 * @returns {Stepper} the stepper object
 */
export function stepper(pattern, handler, continuation = '~', silence = '_') {
  const lines = pattern.split('\n').map((line) => removeWhitespaces(line));

  const maxLineLength = Math.max(...lines.map((line) => line.length));

  const getSymbols = (index) =>
    lines.map((line) => line.charAt(index % maxLineLength));

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
      const symbols = getSymbols(index);

      symbols.forEach((symbol, line) => {
        if (
          symbol !== continuation &&
          symbol !== silence &&
          symbol != null &&
          symbol.length > 0
        ) {
          const duration = getStepDuration(index, line);
          if ('0123456789'.includes(symbol)) {
            symbol = parseInt(symbol, 10);
          }
          handler({ duration, symbol, line });
        }
      });
    },
  };
}
