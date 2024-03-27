import { type Prisma } from '@prisma/client';

export const oneTimeOrder_active: Prisma.OrderUncheckedCreateInput = {
  userId: 1,
  productId: 1,
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  subscriptionEndsAt: null,
};
