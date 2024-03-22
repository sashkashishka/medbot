import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

interface iParams {
  productId: number;
}

export const editProductRoute: RouteOptions = {
  method: 'PATCH',
  url: '/product/:productId',
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
    const params = req.params as iParams;
    const body = req.body as Prisma.ProductCreateManyInput[];

    return this.prisma.product.update({
      where: {
        id: Number(params.productId),
      },
      data: body,
    });
  },
};
