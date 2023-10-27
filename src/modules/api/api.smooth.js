import { getCurrentScope } from './api.scope.js';

export const Curve = {
  linear: 0,
  easeInQuad: 1,
  easeOutQuad: 2,
  easeInOutQuad: 3,
  easeInCubic: 4,
  easeOutCubic: 5,
  easeInOutCubic: 6,
  easeInQuart: 7,
  easeOutQuart: 8,
  easeInOutQuart: 9,
  easeInQuint: 10,
  easeOutQuint: 11,
  easeInOutQuint: 12,
};

// Source: https://gist.github.com/gre/1650294
const easingFunctions = {
  [Curve.linear]: (t) => t,
  [Curve.easeInQuad]: (t) => t * t,
  [Curve.easeOutQuad]: (t) => t * (2 - t),
  [Curve.easeInOutQuad]: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  [Curve.easeInCubic]: (t) => t * t * t,
  [Curve.easeOutCubic]: (t) => --t * t * t + 1,
  [Curve.easeInOutCubic]: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  [Curve.easeInQuart]: (t) => t * t * t * t,
  [Curve.easeOutQuart]: (t) => 1 - --t * t * t * t,
  [Curve.easeInOutQuart]: (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  [Curve.easeInQuint]: (t) => t * t * t * t * t,
  [Curve.easeOutQuint]: (t) => 1 + --t * t * t * t * t,
  [Curve.easeInOutQuint]: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
};

/**
 * @typedef {Object} SmoothedValue
 * @property {function} get - Returns the current value
 * @property {function} setCurve - Sets the default curve type
 * @property {function} setTarget - Sets the target value with an optional curve type
 */

/**
 * Creates a smoothed value.
 * @param defaultValue - The starting value
 * @param defaultCurve - The default curve type
 * @returns {SmoothedValue} A smoothed value
 */
export function smooth(defaultValue = 0, defaultCurve = Curve.linear) {
  const segments = [];
  let currentCurve = defaultCurve;

  const computeValue = (
    t,
    startValue,
    targetValue,
    startTime,
    targetTime,
    curve,
  ) => {
    if (t >= targetTime) {
      return targetValue;
    }

    if (t <= startTime) {
      return startValue;
    }

    const easingFunction = easingFunctions[curve];
    const easingValue = easingFunction(
      (t - startTime) / (targetTime - startTime),
    );
    return startValue + (targetValue - startValue) * easingValue;
  };

  const get = () => {
    if (segments.length === 0) {
      return defaultValue;
    }

    const now = getCurrentScope().cursor;

    let currentSegment;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      if (segment.startTime > now) {
        break;
      }

      currentSegment = segment;
    }

    if (currentSegment) {
      return computeValue(
        now,
        currentSegment.startValue,
        currentSegment.targetValue,
        currentSegment.startTime,
        currentSegment.targetTime,
        currentSegment.curve,
      );
    } else {
      return defaultValue;
    }
  };

  return {
    get,
    setCurve(newCurve) {
      currentCurve = newCurve;
    },
    setTarget(newValue, duration = 0, curve = currentCurve) {
      currentCurve = curve;

      const startTime = getCurrentScope().cursor;
      const startValue = get();

      // Insert the new segment at the right place
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];

        if (segment.startTime > startTime) {
          segments.splice(i, segments.length - i, {
            startTime,
            startValue,
            targetTime: startTime + duration,
            targetValue: newValue,
            curve,
          });
          return;
        }
      }

      // If we didn't find a place, append it
      segments.push({
        startTime,
        startValue,
        targetTime: startTime + duration,
        targetValue: newValue,
        curve,
      });
    },
  };
}
