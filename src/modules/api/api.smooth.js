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

/**
 * @typedef {Object} SmoothedValue
 * @method get - Returns the current value
 * @method setCurve - Sets the default curve type
 * @method setTarget - Sets the target value with an optional curve type
 */

/**
 * Creates a smoothed value.
 * @param defaultValue - The starting value
 */
export function smooth(defaultValue = 0) {
  const segments = [];
  const curve = Curve.linear;

  const computeValue = (
    t,
    startValue,
    targetValue,
    startTime,
    targetTime,
    curve,
  ) => {
    switch (curve) {
      case Curve.linear:
        if (t >= targetTime) {
          return targetValue;
        }

        if (t <= startTime) {
          return startValue;
        }

        return (
          startValue +
          ((targetValue - startValue) * (t - startTime)) /
            (targetTime - startTime)
        );
    }
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
    setTarget(newValue, duration = 0) {
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
