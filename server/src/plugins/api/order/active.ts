import type { RouteOptions } from 'fastify';

export const activeOrderRoute: RouteOptions = {
  method: 'GET',
  url: '/order/active',
  handler() {
    return this.prisma.order.findFirst({
      where: { status: 'ACTIVE' }
    });
  },
};

