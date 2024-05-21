import type { RouteOptions } from 'fastify';
import { serializeOrder } from '../../hooks/serializeOrder.js';

interface iParams {
  userId: number;
}

export const activeOrderRoute: RouteOptions = {
  method: 'GET',
  url: '/order/active/:userId',
  schema: {
    params: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
      },
      required: ['userId'],
    },
  },
  preSerialization: [serializeOrder],
  handler(req) {
    const { userId } = req.params as iParams;

    return this.prisma.order.findFirst({
      where: { status: 'ACTIVE', userId: Number(userId) },
      select: {
        id: true,
        userId: true,
        productId: true,
        status: true,
        subscriptionEndsAt: true,
        createdAt: true,
        activationCode: true,
      },
    });
  },
};
