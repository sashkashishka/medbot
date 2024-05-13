import type { RouteOptions } from 'fastify';
import { serializeUserList } from '../../hooks/serializeUser.js';

interface iQuerystring {
  skip: number;
  take: number;
  date_sort: 'asc' | 'desc';
}

export const userListRoute: RouteOptions = {
  method: 'GET',
  url: '/user/list',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        take: { type: 'number', default: 20 },
        skip: { type: 'number', default: 0 },
        date_sort: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
      },
    },
  },
  preSerialization: [serializeUserList],
  async handler(req) {
    const query = req.query as iQuerystring;

    const [items, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: Number(query.skip),
        take: Number(query.take),
        orderBy: {
          id: query.date_sort,
        },
      }),
      this.prisma.user.count(),
    ]);

    return { items, count };
  },
};
