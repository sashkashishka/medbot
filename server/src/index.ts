import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import { logger } from './logger.js';
import { envPluginConfig } from './plugins/config/index.js';

process.env.TZ = 'Etc/Universal';

const fastify = Fastify({
  logger,
});

await fastify.register(fastifyEnv, envPluginConfig);
fastify.register(import('./plugins/prisma/index.js'));
fastify.register(import('./plugins/google-calendar/index.js'));
fastify.register(import('./plugins/medbot/index.js'));
fastify.register(import('./plugins/api/index.js'), { prefix: '/api' });

// TODO serve static for webapp

// Run the server!
async function main(): Promise<void> {
  try {
    await fastify.listen({
      port: fastify.config.PORT,
      host: '0.0.0.0',
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
