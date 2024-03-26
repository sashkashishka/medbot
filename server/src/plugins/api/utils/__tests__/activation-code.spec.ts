import t from 'tap';
import { generateActivationCodes, isDuplicate } from '../activation-code.js';

const test = t.test;

test('isDuplicate', (t) => {
  t.equal(isDuplicate(1, [1, 2, 3]), true);
  t.equal(isDuplicate(4, [1, 2, 3]), false);

  t.end();
});

test('generateActivationCodes', (t) => {
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

  t.matchStrict(
    generateActivationCodes(4, codes, min, max).sort(),
    generatedCodes.map(({ code }) => code),
    'must generate 4 codes that do not exists',
  );
  t.end();
});
