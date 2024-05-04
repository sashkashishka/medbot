import type { RouteOptions } from 'fastify';
import { checkIfSubscriptionOrderExpired2 } from '../../hooks/checkIfSubscriptionOrderExpired.js';

interface iParams {
  userId: string;
}

export const activeAppointmentRoute: RouteOptions = {
  method: 'GET',
  url: '/appointment/:userId',
  schema: {
    params: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
      },
      required: ['userId'],
    },
  },
  preHandler: [checkIfSubscriptionOrderExpired2],
  async handler(request) {
    const params = request.params as iParams;

    const { userId } = params;

    return this.prisma.appointment.findFirst({
      where: {
        userId: Number(userId),
        status: 'ACTIVE',
      },
      select: {
        id: true,
        orderId: true,
        userId: true,
        chronicDiseases: true,
        medicine: true,
        complaints: true,
        complaintsStarted: true,
        time: true,
        status: true,
      },
    });
  },
};
