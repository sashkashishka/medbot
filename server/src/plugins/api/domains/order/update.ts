import { Prisma } from '@prisma/client';
import { addMonths } from 'date-fns';
import type { RouteOptions } from 'fastify';
import { OrderError } from '../../utils/errors.js';
import { generateActivationCodes } from '../../utils/activation-code.js';

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
        productId: { type: 'string' },
        userId: { type: 'string' },
        status: { type: 'string' },
      },
      required: ['status', 'productId', 'userId'],
    },
  },
  async preHandler(req) {
    const params = req.params as iParams;

    const order = await this.prisma.order.findFirst({
      where: {
        id: Number(params.orderId),
      },
    });

    if (order?.status === 'DONE') {
      throw new OrderError('cannot-update-not-active-order');
    }
  },
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
    });
  },
};
