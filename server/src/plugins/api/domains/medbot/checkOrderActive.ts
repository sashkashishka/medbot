import type { RouteOptions } from 'fastify';

interface iParams {
  id: string;
}

interface iQuerystring {
  id: 'messageThreadId' | 'botChatId';
}

export const checkOrderActiveRoute: RouteOptions = {
  method: 'GET',
  url: '/check-order-active/:id',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          enum: ['messageThreadId', 'botChatId'],
          default: 'desc',
        },
      },
    },
  },
  async handler(req) {
    const params = req.params as iParams;
    const query = req.query as iQuerystring;
    const { id } = params;

    const count = await this.prisma.order.count({
      where: {
        OR: [
          {
            user: {
              [query.id]: Number(id),
            },
            status: 'ACTIVE',
            subscriptionEndsAt: {
              gte: new Date(),
            },
          },
          {
            user: {
              [query.id]: Number(id),
            },
            status: 'ACTIVE',
            subscriptionEndsAt: null,
          },
        ],
      },
    });

    return { active: Boolean(count) };
  },
};
