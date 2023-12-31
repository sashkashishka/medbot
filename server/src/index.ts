import Fastify from 'fastify';
import { logger } from './logger.js';

process.env.TZ = 'Etc/Universal';

const fastify = Fastify({
  logger,
});

fastify.register(import('./plugins/prisma/index.js'));
fastify.register(import('./plugins/google-calendar/index.js'));
fastify.register(import('./plugins/medbot/index.js'));
fastify.register(import('./plugins/api/index.js'), { prefix: '/api' });

// TODO serve static for webapp

// Run the server!
async function main(): Promise<void> {
  try {
    await fastify.listen({
      port: (process.env.PORT as unknown as number) || 8000,
      host: '0.0.0.0',
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
