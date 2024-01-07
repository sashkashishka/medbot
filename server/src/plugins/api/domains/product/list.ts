import type { RouteOptions } from 'fastify';

export const productListRoute: RouteOptions = {
  method: 'GET',
  url: '/product/list',
  handler() {
    return this.prisma.product.findMany();
  },
};
