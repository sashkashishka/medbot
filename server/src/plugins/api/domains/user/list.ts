import type { RouteOptions } from 'fastify';

interface iParams {
  skip: number;
  take: number;
}

export const userListRoute: RouteOptions = {
  method: 'GET',
  url: '/user/list/:take/:skip',
  async handler(req) {
    const params = req.params as iParams;

    const [items, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: Number(params.skip || 0),
        take: Number(params.take || 20),
      }),
      this.prisma.user.count(),
    ]);

    return { items, count };
  },
};
