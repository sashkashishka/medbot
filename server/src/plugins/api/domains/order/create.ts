import { addMonths } from 'date-fns';
import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';
import { OrderError } from '../../utils/errors.js';

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
  async preHandler(req) {
    const body = req.body as Prisma.OrderUncheckedCreateInput;

    const orders = await this.prisma.order.findMany({
      where: {
        userId: body.userId,
        status: 'ACTIVE',
      },
    });

    if (orders.length) {
      throw new OrderError('has-active');
    }
  },
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
