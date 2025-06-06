const shuffleArray = require('../shuffleArray');

describe('shuffleArray', () => {
  test('returns a permutation of the input array', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result).toHaveLength(input.length);
    expect(result.sort()).toEqual([...input].sort());
  });

  test('handles empty array', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  test('handles single-element array', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});
