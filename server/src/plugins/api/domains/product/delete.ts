import type { RouteOptions } from 'fastify';

interface iParams {
  productId: number;
}

export const deleteProductRoute: RouteOptions = {
  method: 'DELETE',
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

    return this.prisma.product.delete({
      where: {
        id: Number(params.productId),
      },
    });
  },
};
