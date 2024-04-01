import type { RouteOptions } from 'fastify';

interface iParams {
  productId: number;
}

export const productRoute: RouteOptions = {
  method: 'GET',
  url: '/product/:productId',
  handler(req) {
    const params = req.params as iParams;

    return this.prisma.product.findFirst({
      where: { id: Number(params.productId) },
    });
  },
};
