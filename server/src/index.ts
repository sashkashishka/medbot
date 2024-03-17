import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import { logger } from './logger.js';

import { envPluginConfig } from './plugins/config/index.js';
import { prismaPlugin } from './plugins/prisma/index.js';
import { googleCalendarPlugin } from './plugins/google-calendar/index.js';
import { medbotPlugin } from './plugins/medbot/index.js';
import { apiPlugin } from './plugins/api/index.js';
import { serviceApiSdk } from './plugins/serviceApiSdk/index.js';

process.env.TZ = 'Etc/Universal';

const fastify = Fastify({
  logger,
});

await fastify.register(fastifyEnv, envPluginConfig);
await fastify.register(prismaPlugin);
await fastify.register(googleCalendarPlugin);
await fastify.register(apiPlugin, { prefix: '/api' });
await fastify.register(serviceApiSdk);
await fastify.register(medbotPlugin);

// TODO serve static for webapp

// Run the server!
async function main(): Promise<void> {
  try {
    await fastify.listen({
      port: fastify.config.PORT,
      host: fastify.config.HOST,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
