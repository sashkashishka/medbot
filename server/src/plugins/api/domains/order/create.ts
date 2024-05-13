import { addMonths } from 'date-fns';
import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';
import { checkIfUserHasActiveOrder } from '../../hooks/checkIfUserHasActiveOrder.js';
import { checkDuplicateOrderWithSameProduct } from '../../hooks/checkDuplicateOrderWithSameProduct.js';
import { userIdToNumber } from '../../utils/userIdToNumber.js';
import { serializeOrder } from '../../hooks/serializeOrder.js';

export const createOrderRoute: RouteOptions = {
  method: 'POST',
  url: '/order/create',
  schema: {
    body: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        productId: { type: 'number' },
        // TODO remove status when implementing payment
        status: { type: 'string' },
      },
      required: ['userId', 'productId', 'status'],
    },
  },
  preHandler: [checkIfUserHasActiveOrder, checkDuplicateOrderWithSameProduct],
  preSerialization: [serializeOrder],
  async handler(req) {
    const { productId, userId, status } =
      req.body as Prisma.OrderUncheckedCreateInput;

    const product = await this.prisma.product.findUnique({
      where: { id: Number(productId) },
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
        productId,
        userId,
        status,
        subscriptionEndsAt,
        createdAt: new Date(),
      },
    });
  },
};
