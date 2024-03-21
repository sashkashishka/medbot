import type { RouteOptions } from 'fastify';
import type { JwtPayloadData } from '../../types.js';

export const adminRoute: RouteOptions = {
  method: 'GET',
  url: '/admin',
  async handler(request) {
    const payloadData = await request.jwtDecode<JwtPayloadData>();

    const admin = await this.prisma.admin.findFirst({
      where: {
        id: payloadData.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return admin;
  },
};
