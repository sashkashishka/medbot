import type { RouteOptions } from 'fastify';
import { createDecorateWithOrder } from '../../hooks/preHandler/decorateWithOrder.js';
import { hasOrderActiveAppointments } from '../../hooks/preHandler/hasOrderActiveAppointments.js';
import { cannotCompleteNonExpiredSubscription } from '../../hooks/preHandler/cannotCompleteNonExpiredSubscription.js';
import { cannotUpdateNotActiveOrder } from '../../hooks/preHandler/cannotUpdateNotActiveOrder.js';

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
  preHandler: [
    createDecorateWithOrder('params'),
    cannotUpdateNotActiveOrder,
    cannotCompleteNonExpiredSubscription,
    hasOrderActiveAppointments,
  ],
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
