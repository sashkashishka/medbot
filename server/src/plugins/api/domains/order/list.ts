import type { RouteOptions } from 'fastify';

interface iParams {
  skip: number;
  take: number;
}

export const orderListRoute: RouteOptions = {
  method: 'GET',
  url: '/order/list/:take/:skip',
  async handler(req) {
    const params = req.params as iParams;

    const [items, count] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        skip: Number(params.skip || 0),
        take: Number(params.take || 20),
      }),
      this.prisma.order.count(),
    ]);

    return { items, count };
  },
};
