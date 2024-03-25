import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../../utils/errors.js';

export const hasOrderActiveAppointments: preHandlerAsyncHookHandler =
  async function hasOrderActiveAppointments(request) {
    const params = request.params as { orderId: string };

    const appointments = await this.prisma.appointment.findMany({
      where: {
        orderId: Number(params.orderId),
        status: 'ACTIVE',
      },
    });

    if (appointments?.length) {
      throw new OrderError('complete-appointment-before-closing-order');
    }
  };
