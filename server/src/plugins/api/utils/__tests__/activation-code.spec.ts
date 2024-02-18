import { generateActivationCodes, isDuplicate } from '../activation-code.js';

describe('isDuplicate', () => {
  it.each([
    [1, [1, 2, 3], true],
    [4, [1, 2, 3], false],
  ])('%p', (code, codes, result) => {
    expect(isDuplicate(code, codes)).toBe(result);
  });
});

describe('generateActivationCodes', () => {
  it('must generate 4 codes that do not exists', () => {
    const min = 1000;
    const max = 9999;
    const codes = Array.from({ length: max - min + 1 }).map((_v, i) => ({
      code: min + i,
    }));
    const ids = [8, 101, 1832, 8432];

    const generatedCodes = ids.map((id) => {
      const { code } = codes[id];

      codes[id] = { code: undefined };

      return { code };
    });

    expect(generateActivationCodes(4, codes, min, max).sort()).toEqual(
      generatedCodes.map(({ code }) => code),
    );
  });
});
