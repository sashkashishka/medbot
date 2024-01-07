import type { RouteOptions } from 'fastify';

interface iQuery {
  orderId: string;
  limit: string;
}

export const appointmentListRoute: RouteOptions = {
  method: 'GET',
  url: '/appointment/list',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        orderId: { type: 'string' },
        limit: { type: 'string' },
      },
      required: ['orderId'],
    },
  },
  handler(req) {
    const query = req.query as iQuery;

    return this.prisma.appointment.findMany({
      where: {
        orderId: Number(query.orderId),
      },
      take: Number(query.limit) ?? 10,
      orderBy: {
        time: 'asc',
      },
    });
  },
};
