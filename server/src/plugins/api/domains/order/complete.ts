import type { RouteOptions } from 'fastify';
import { OrderError } from '../../utils/errors.js';

interface iParams {
  orderId: string;
}

export const completeOrderRoute: RouteOptions = {
  method: 'PATCH',
  url: '/order/complete/:orderId',
  schema: {
    body: {
      type: 'object',
      properties: {
        productId: { type: 'number' },
        userId: { type: 'number' },
      },
      required: ['productId', 'userId'],
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

    if (order?.subscriptionEndsAt) {
      throw new OrderError('cannot-complete-non-expired-subscription');
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        orderId: Number(params.orderId),
        status: 'ACTIVE',
      },
    });

    if (appointments?.length) {
      throw new OrderError('complete-appointment-before-closing-order');
    }
  },
  async handler(req) {
    const params = req.params as iParams;

    return this.prisma.order.update({
      where: { id: Number(params.orderId) },
      data: {
        status: 'DONE',
      },
    });
  },
};
