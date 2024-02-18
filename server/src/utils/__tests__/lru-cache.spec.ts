import { LRUCache } from '../lru-cache.js';

describe('LRUCache', () => {
  test.each([
    [
      [[1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]] as const,
      [null, null, 1, null, -1, null, -1, 3, 4],
      2,
    ],
    [[[2, 1], [2], [3, 2], [2], [3]] as const, [null, 1, null, -1, 2], 1],
    [
      [[2], [2, 6], [1], [1, 5], [1, 2], [1], [2]] as const,
      [-1, null, -1, null, null, 2, 6],
      2,
    ],
    [
      [[2, 1], [1, 1], [2, 3], [4, 1], [1], [2]] as const,
      [null, null, null, null, -1, 3],
      2,
    ],
  ])('%j', (args, expectation, size) => {
    const lru = new LRUCache(size);

    args.map((a, i) => {
      switch (a.length) {
        case 2: {
          const [key, val] = a;
          lru.put(key, val);
          break;
        }

        case 1: {
          const [key] = a;
          expect(lru.get(key)).toBe(expectation[i]);
          break;
        }
      }
    });
  });
});
