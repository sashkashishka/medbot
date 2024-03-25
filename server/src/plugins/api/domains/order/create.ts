import { addMonths } from 'date-fns';
import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';
import { canCreateOneOrder } from '../../hooks/preHandler/canCreateOneOrder.js';

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
      required: ['userId', 'productId', 'status'],
    },
  },
  preHandler: [canCreateOneOrder],
  async handler(req) {
    const body = req.body as Prisma.OrderUncheckedCreateInput;

    const product = await this.prisma.product.findUnique({
      where: { id: Number(body.productId) },
    });

    let subscriptionEndsAt: string = null;

    if (product.subscriptionDuration > 0) {
      subscriptionEndsAt = addMonths(
        new Date(),
        product.subscriptionDuration,
      ).toISOString();
    }

    return this.prisma.order.create({
      data: {
        ...body,
        subscriptionEndsAt,
        createdAt: new Date(),
      },
    });
  },
};
