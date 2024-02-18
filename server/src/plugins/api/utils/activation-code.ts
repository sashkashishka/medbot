export function createActivationCode(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

export function isDuplicate(code: number, codes: number[]): boolean {
  return codes.includes(code);
}

export function generateActivationCodes(
  qty: number,
  activeCodes: Array<{ code: number }>,
  min = 1000,
  max = 9999,
): number[] {
  const existingCodes = activeCodes.map(({ code }) => code).slice();

  return Array.from({ length: qty }).map(() => {
    let code = createActivationCode(min, max);

    while (existingCodes.includes(code)) {
      code = createActivationCode(min, max);
    }

    existingCodes.push(code);

    return code;
  });
}
