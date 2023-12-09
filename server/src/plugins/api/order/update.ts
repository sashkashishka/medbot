import type { RouteOptions } from 'fastify';

// TODO check why Prisma.OrderScalar sets all values to boolean
export const updateOrderRoute: RouteOptions = {
  method: 'POST',
  url: '/order/update',
  schema: {
    body: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string' },
      },
      required: ['id', 'status'],
    },
  },
  handler(req) {
    const body = req.body as { id: number };

    return this.prisma.order.update({
      where: { id: body.id },
      data: body,
    });
  },
};
