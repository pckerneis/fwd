export function getNoteNumberConstants() {
  const symbols = [
    ['C', 'Bs'],
    ['Cs', 'Db'],
    ['D'],
    ['Ds', 'Eb'],
    ['E'],
    ['F', 'Es'],
    ['Fs', 'Gb'],
    ['G'],
    ['Gs', 'Ab'],
    ['A'],
    ['As', 'Bb'],
    ['B', 'Cb'],
  ];

  const result = {};

  for (let i = 21; i < 128; i++) {
    const n = i - 21;
    const octave = ~~(n / 12) - 2;

    if (octave >= 0) {
      symbols[n % 12].map((s) => s + octave).forEach((s) => (result[s] = n));
    }
  }

  return result;
}
