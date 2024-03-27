import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../../utils/errors.js';

export const checkDuplicateOrderWithSameProduct: preHandlerAsyncHookHandler =
  async function checkDuplicateOrderWithSameProduct(request) {
    const body = request.body as Prisma.OrderUncheckedCreateInput;

    const order = await this.prisma.order.findFirst({
      where: {
        productId: Number(body.productId),
        status: 'WAITING_FOR_PAYMENT',
      },
    });

    if (order) {
      throw new OrderError(
        'duplicate-waiting-for-payment-order-with-same-product',
      );
    }
  };
