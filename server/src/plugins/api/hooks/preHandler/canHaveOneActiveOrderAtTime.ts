import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../../utils/errors.js';

export const canHaveOneActiveOrderAtTime: preHandlerAsyncHookHandler =
  async function canHaveOneActiveOrderAtTime(request) {
    const body = request.body as Prisma.OrderUncheckedCreateInput;

    const orders = await this.prisma.order.findMany({
      where: {
        userId: body.userId,
        status: 'ACTIVE',
      },
    });

    if (orders.length) {
      throw new OrderError('has-active');
    }
  };
