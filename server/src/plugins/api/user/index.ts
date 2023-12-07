import type { RouteOptions } from 'fastify';

interface iQuery {
  id: number;
}

export const userRoute: RouteOptions = {
  method: 'GET',
  url: '/user',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      }
    }
  },
  handler(req) {
    const query = req.query as iQuery;

    return this.prisma.user.findFirst({
      where: { id: Number(query.id) }
    });
  },
};

