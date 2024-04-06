import Fastify, { type FastifyPluginAsync } from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { logger } from './logger.js';

import { envPluginConfig } from './plugins/config/index.js';
import { prismaPlugin } from './plugins/prisma/index.js';
import { googleCalendarPlugin } from './plugins/google-calendar/index.js';
import { medbotPlugin } from './plugins/medbot/index.js';
import { apiPlugin } from './plugins/api/index.js';
import { serviceApiSdk } from './plugins/serviceApiSdk/index.js';

process.env.TZ = 'Etc/Universal';

interface iOptions {
  plugins?: {
    medbot?: FastifyPluginAsync;
    googleCalendar?: FastifyPluginAsync;
  };
}

// Run the server!
export async function main({
  plugins: {
    medbot = medbotPlugin,
    googleCalendar = googleCalendarPlugin,
  } = {},
}: iOptions = {}) {
  const fastify = Fastify({
    logger,
  });

  try {
    await fastify.register(fastifyEnv, envPluginConfig);
    await fastify.register(fastifyCookie, {
      secret: fastify.config.COOKIE_SECRET,
    });
    await fastify.register(fastifyJwt, {
      secret: fastify.config.JWT_SECRET,
      cookie: { cookieName: 'token', signed: false },
    });

    await fastify.register(prismaPlugin);
    await fastify.register(googleCalendar);
    await fastify.register(apiPlugin, { prefix: '/api' });
    await fastify.register(serviceApiSdk);
    await fastify.register(medbot);

    await fastify.listen({
      port: fastify.config.PORT,
      host: fastify.config.HOST,
    });

    return fastify;
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
