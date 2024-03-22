import type { RouteOptions } from 'fastify';

interface iParams {
  skip: number;
  take: number;
}

export const appointmentListRoute: RouteOptions = {
  method: 'GET',
  url: '/appointment/list/:take/:skip',
  async handler(req) {
    const params = req.params as iParams;

    const [items, count] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        skip: Number(params.skip || 0),
        take: Number(params.take || 20),
      }),
      this.prisma.appointment.count(),
    ]);

    return { items, count };
  },
};
