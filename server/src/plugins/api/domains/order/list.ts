import { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

interface iQuerystring {
  skip: number;
  take: number;
  user_id: number;
  date_sort: 'asc' | 'desc';
  status: Prisma.OrderUncheckedCreateInput['status'];
  has_subscription: 0 | 1;
}

export const orderListRoute: RouteOptions = {
  method: 'GET',
  url: '/order/list',
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
          enum: ['ACTIVE', 'WAITING_FOR_PAYMENT', 'DONE'],
        },
        has_subscription: {
          type: 'number',
          enum: [0, 1],
        },
      },
    },
  },
  async handler(req) {
    const query = req.query as iQuerystring;

    const [items, count] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        skip: Number(query.skip),
        take: Number(query.take),
        orderBy: {
          createdAt: query.date_sort,
        },
        where: {
          userId: query.user_id,
          status: query.status,
          subscriptionEndsAt: query.has_subscription
            ? { not: null }
            : undefined,
        },
      }),
      this.prisma.order.count(),
    ]);

    return { items, count };
  },
};
