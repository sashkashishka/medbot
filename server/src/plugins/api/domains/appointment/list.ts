import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

interface iQuerystring {
  skip: number;
  take: number;
  user_id: number;
  date_sort: 'asc' | 'desc';
  status: Prisma.AppointmentUncheckedCreateInput['status'];
}

export const appointmentListRoute: RouteOptions = {
  method: 'GET',
  url: '/appointment/list',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        take: { type: 'number', default: 20 },
        skip: { type: 'number', default: 0 },
        user_id: { type: 'number' },
        date_sort: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'DELETED', 'DONE'],
        },
      },
    },
  },
  async handler(req) {
    const query = req.query as iQuerystring;

    const [items, count] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        skip: Number(query.skip),
        take: Number(query.take),
        orderBy: {
          time: query.date_sort,
        },
        where: {
          status: query.status,
          userId: query.user_id,
        },
      }),
      this.prisma.appointment.count(),
    ]);

    return { items, count };
  },
};
