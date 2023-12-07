import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

// TODO add validation for user rights. only admin can add products
export const createProductRoute: RouteOptions = {
  method: 'POST',
  url: '/product/create',
  schema: {
    body: {
      type: 'array',
      items: {
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
  },
  handler(req) {
    const body = req.body as Prisma.ProductCreateManyInput[];

    return this.prisma.product.createMany({
      data: body,
    });
  },
};
