import type { RouteOptions } from 'fastify';

export const configRoute: RouteOptions = {
  method: 'GET',
  url: '/config',
  handler() {
    return {
      googleEmail: this.config.GOOGLE_EMAIL,
    };
  },
};
