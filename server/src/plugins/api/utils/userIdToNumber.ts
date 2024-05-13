import type { Prisma } from '@prisma/client';

export function userIdToNumber<T = Prisma.UserUncheckedCreateInput>(
  obj: T,
  key = 'id',
) {
  return {
    ...obj,
    [key]: Number(obj[key]),
  };
}
