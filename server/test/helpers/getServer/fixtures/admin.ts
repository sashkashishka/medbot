import type { Prisma } from '@prisma/client';

export const admin: Prisma.AdminUncheckedCreateInput = {
  name: 'Jon',
  password: '123',
};
