import { type Prisma } from '@prisma/client';
import { addMonths } from 'date-fns';

export const subscriptionOrder_active: Prisma.OrderUncheckedCreateInput = {
  userId: 1,
  productId: 3,
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  subscriptionEndsAt: addMonths(new Date(), 1).toISOString(),
};

