import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../utils/errors.js';

export const checkDuplicateOrderWithSameProduct: preHandlerAsyncHookHandler =
  async function checkDuplicateOrderWithSameProduct(request) {
    const body = request.body as Prisma.OrderUncheckedCreateInput;

    const count = await this.prisma.order.count({
      where: {
        productId: Number(body.productId),
        status: 'WAITING_FOR_PAYMENT',
      },
    });

    if (count > 0) {
      throw new OrderError(
        'duplicate-waiting-for-payment-order-with-same-product',
      );
    }
  };
