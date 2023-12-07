import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

export const createOrderRoute: RouteOptions = {
  method: 'POST',
  url: '/order/create',
  schema: {
    body: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        productId: { type: 'number' },
        status: { type: 'string' },
      },
      required: [
        'userId',
        'productId',
        'status',
      ],
    },
  },
  handler(req) {
    const body = req.body as Prisma.OrderCreateInput;

    return this.prisma.order.create({
      data: {
        ...body,
        createdAt: new Date(),
      },
    });
  },
};
