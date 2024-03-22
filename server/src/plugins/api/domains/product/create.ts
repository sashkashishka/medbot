import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

export const createProductRoute: RouteOptions = {
  method: 'PUT',
  url: '/product/create',
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        memberQty: { type: 'number' },
        subscriptionDuration: { type: 'number' },
      },
      required: [
        'name',
        'description',
        'price',
        'memberQty',
        'subscriptionDuration',
      ],
    },
  },
  handler(req) {
    const body = req.body as Prisma.ProductCreateManyInput;

    return this.prisma.product.create({
      data: body,
    });
  },
};
