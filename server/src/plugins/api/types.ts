import type { Prisma } from '@prisma/client';

export interface JwtPayloadData
  extends Pick<Prisma.AdminUncheckedCreateInput, 'id' | 'name'> {}
