import type { RouteOptions } from 'fastify';

interface iParams {
  id: number;
}

export const userRoute: RouteOptions = {
  method: 'GET',
  url: '/user/:id',
  handler(req) {
    const { id } = req.params as iParams;

    return this.prisma.user.findFirst({
      where: { id: Number(id) },
    });
  },
};
