import { Prisma } from '@prisma/client';
import { addMonths } from 'date-fns';
import type { RouteOptions } from 'fastify';

import { generateActivationCodes } from '../../utils/activation-code.js';
import { createDecorateWithOrder } from '../../hooks/decorateWithOrder.js';
import { checkIsDoneOrder } from '../../hooks/checkIsDoneOrder.js';

interface iParams {
  orderId: string;
}

export const updateOrderRoute: RouteOptions = {
  method: 'PATCH',
  url: '/order/update/:orderId',
  schema: {
    body: {
      type: 'object',
      properties: {
        productId: { type: 'number' },
        userId: { type: 'number' },
        status: { type: 'string', enum: ['ACTIVE', 'WAITING_FOR_PAYMENT'] },
      },
      required: ['status', 'productId', 'userId'],
    },
  },
  preHandler: [createDecorateWithOrder('params'), checkIsDoneOrder],
  async handler(req) {
    const params = req.params as iParams;
    const body = req.body as Prisma.OrderUncheckedCreateInput;

    const product = await this.prisma.product.findUnique({
      where: { id: Number(body.productId) },
    });

    if (product.subscriptionDuration > 0) {
      const activationCodes = await this.prisma.activationCode.findMany({
        select: {
          code: true,
        },
      });

      const codes = generateActivationCodes(
        Math.max(0, product.memberQty - 1),
        activationCodes,
      );

      if (codes?.length) {
        await this.prisma.activationCode.createMany({
          data: codes.map((code) => ({
            code,
            orderId: Number(params.orderId),
            productId: product.id,
            invalidAt: addMonths(
              new Date(),
              product.subscriptionDuration,
            ).toISOString(),
          })),
        });
      }
    }

    return this.prisma.order.update({
      where: { id: Number(params.orderId) },
      data: body,
      select: {
        id: true,
        userId: true,
        productId: true,
        status: true,
        createdAt: true,
        subscriptionEndsAt: true,
        activationCode: true,
      },
    });
  },
};
