import type { RouteOptions } from 'fastify';

interface iParams {
  userId: string;
}

export const activeAppointmentRoute: RouteOptions = {
  method: 'GET',
  url: '/appointment/:userId',
  async handler(request) {
    const params = request.params as iParams;

    const { userId } = params;

    return this.prisma.appointment.findFirst({
      where: {
        userId: Number(userId),
        status: 'ACTIVE',
      },
    });
  },
};
