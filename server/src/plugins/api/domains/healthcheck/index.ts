import type { RouteOptions } from 'fastify';

export const healthcheckRoute: RouteOptions = {
  method: 'GET',
  url: '/healthcheck',
  handler() {
    return { status: 'ok' };
  },
};
