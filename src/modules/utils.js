export function isFinitePositiveNumber(value) {
  return (
    typeof value === 'number' &&
    !Number.isNaN(value) &&
    value > 0 &&
    Number.isFinite(value)
  );
}
