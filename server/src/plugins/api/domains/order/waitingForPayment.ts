import type { RouteOptions } from 'fastify';
import { serializeOrder } from '../../hooks/serializeOrder.js';

interface iParams {
  userId: number;
  productId: number;
}

export const waitingForPaymentOrderRoute: RouteOptions = {
  method: 'GET',
  url: '/order/waiting-for-payment/:userId/:productId',
  schema: {
    params: {
      type: 'object',
      properties: {
        productId: { type: 'number' },
        userId: { type: 'number' },
      },
      required: ['productId', 'userId'],
    },
  },
  preSerialization: [serializeOrder],
  handler(req) {
    const { userId, productId } = req.params as iParams;

    return this.prisma.order.findFirst({
      where: {
        status: 'WAITING_FOR_PAYMENT',
        userId: Number(userId),
        productId: Number(productId),
      },
    });
  },
};
