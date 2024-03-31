import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../utils/errors.js';

export const checkHasOrderActiveAppointments: preHandlerAsyncHookHandler =
  async function checkHasOrderActiveAppointments(request) {
    const params = request.params as { orderId: string };

    const count = await this.prisma.appointment.count({
      where: {
        orderId: Number(params.orderId),
        status: 'ACTIVE',
      },
    });

    if (count > 0) {
      throw new OrderError('complete-appointment-before-closing-order');
    }
  };
