import type { RouteOptions } from 'fastify';
import { createDecorateWithOrder } from '../../hooks/decorateWithOrder.js';
import { checkHasOrderActiveAppointments } from '../../hooks/checkHasOrderActiveAppointments.js';
import { checkIsDoneOrder } from '../../hooks/checkIsDoneOrder.js';
import { checkIfSubscriptionOrderExpired } from '../../hooks/checkIfSubscriptionOrderExpired.js';
import { checkIfSubscriptionOrderAlive } from '../../hooks/checkIfSubscriptionOrderAlive.js';
import { serializeOrder } from '../../hooks/serializeOrder.js';

interface iParams {
  orderId: string;
}

export const completeOrderRoute: RouteOptions = {
  method: 'PATCH',
  url: '/order/complete/:orderId',
  schema: {
    params: {
      type: 'object',
      properties: {
        orderId: { type: 'number' },
      },
      required: ['orderId'],
    },
  },
  preHandler: [
    createDecorateWithOrder('params'),
    checkIsDoneOrder,
    checkIfSubscriptionOrderExpired,
    checkIfSubscriptionOrderAlive,
    checkHasOrderActiveAppointments,
  ],
  preSerialization: [serializeOrder],
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
