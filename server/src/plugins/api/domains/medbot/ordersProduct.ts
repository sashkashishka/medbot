import type { RouteOptions } from 'fastify';

interface iParams {
  id: string;
}

interface iQuerystring {
  id: 'messageThreadId' | 'botChatId';
}

export const ordersProductRoute: RouteOptions = {
  method: 'GET',
  url: '/orders-product/:id',
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
    params: {
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
      required: ['id'],
    },
  },
  async handler(req) {
    const params = req.params as iParams;
    const query = req.query as iQuerystring;
    const { id } = params;

    return this.prisma.product.findFirst({
      where: {
        order: {
          some: {
            status: 'ACTIVE',
            user: {
              [query.id]: Number(id),
            },
          },
        },
      },
    });
  },
};
