import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../utils/errors.js';

export const checkIfUserHasActiveOrder: preHandlerAsyncHookHandler =
  async function checkIfUserHasActiveOrder(request) {
    const body = request.body as Prisma.OrderUncheckedCreateInput;

    const count = await this.prisma.order.count({
      where: {
        userId: Number(body.userId),
        status: 'ACTIVE',
      },
    });

    if (count > 0) {
      throw new OrderError('has-active');
    }
  };
