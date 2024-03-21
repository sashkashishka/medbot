import type { RouteOptions } from 'fastify';

export const logoutAdminRoute: RouteOptions = {
  method: 'DELETE',
  url: '/logout',
  async handler(_request, reply) {
    return reply.clearCookie('token').code(200).send({ done: true });
  },
};
