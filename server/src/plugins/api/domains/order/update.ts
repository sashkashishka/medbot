import { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

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
        status: { type: 'string' },
      },
      required: ['status'],
    },
  },
  handler(req) {
    const params = req.params as iParams;
    const body = req.body as Prisma.OrderUncheckedCreateInput;

    return this.prisma.order.update({
      where: { id: Number(params.orderId) },
      data: body,
    });
  },
};
