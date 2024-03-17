import fp from 'fastify-plugin';
import { type FastifyPluginAsync } from 'fastify';

import { ServiceApiSdk } from './sdk.js';

declare module 'fastify' {
  // eslint-disable-next-line
  interface FastifyInstance {
    serviceApiSdk: ServiceApiSdk;
  }
}

export const serviceApiSdk: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorate(
    'serviceApiSdk',
    new ServiceApiSdk(
      fastify.log,
      fastify.config.HOST,
      fastify.config.TG_BOT_TOKEN,
    ),
  );
});
