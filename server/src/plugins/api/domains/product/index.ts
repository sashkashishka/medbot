import type { RouteOptions } from 'fastify';

interface iParams {
  productId: number;
}

export const productRoute: RouteOptions = {
  method: 'GET',
  url: '/product/:productId',
  schema: {
    params: {
      type: 'object',
      properties: {
        productId: { type: 'number' },
      },
      required: ['productId'],
    },
  },
  handler(req) {
    const params = req.params as iParams;

    return this.prisma.product.findFirst({
      where: { id: Number(params.productId) },
    });
  },
};
