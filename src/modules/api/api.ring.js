/**
 * @module Ring
 */

/**
 * Creates a ring function.
 * A ring (or circular buffer) acts like a list whose end is connected to its start.
 * The returned function takes a positive or negative index and returns the element at that index.
 * Negative indices are counted from the end of the list. For example, -1 is the last element.
 * If the index is not an integer, it is rounded down.
 *
 * @example
 * const ring = ring('a', 'b', 'c');
 * ring(-3); // 'a'
 * ring(-2); // 'b'
 * ring(-1); // 'c'
 * ring(0); // 'a'
 * ring(1); // 'b'
 * ring(2); // 'c'
 * ring(3); // 'a'
 * ring(1.4); // 'b'
 *
 * @param {...*} elements - Elements to circle through
 * @return {function} a getter function to retrieve element at index
 */
export function ring(...elements) {
  const length = elements.length;
  return (i) => elements[((i % length) + length) % length];
}
