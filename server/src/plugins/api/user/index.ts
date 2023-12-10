import type { RouteOptions } from 'fastify';

interface iParams {
  userId: number;
}

export const userRoute: RouteOptions = {
  method: 'GET',
  url: '/user/:userId',
  handler(req) {
    const { userId } = req.params as iParams;

    return this.prisma.user.findFirst({
      where: { id: Number(userId) },
    });
  },
};
