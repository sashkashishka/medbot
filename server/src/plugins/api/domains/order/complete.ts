import type { RouteOptions } from 'fastify';
import { createDecorateWithOrder } from '../../hooks/preHandler/decorateWithOrder.js';
import { hasOrderActiveAppointments } from '../../hooks/preHandler/hasOrderActiveAppointments.js';
import { cannotCompleteNonExpiredSubscription } from '../../hooks/preHandler/cannotCompleteNonExpiredSubscription.js';
import { cannotUpdateDoneOrder } from '../../hooks/preHandler/cannotUpdateDoneOrder.js';

interface iParams {
  orderId: string;
}

export const completeOrderRoute: RouteOptions = {
  method: 'PATCH',
  url: '/order/complete/:orderId',
  preHandler: [
    createDecorateWithOrder('params'),
    cannotUpdateDoneOrder,
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
