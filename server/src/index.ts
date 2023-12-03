import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});

fastify.register(import('./plugins/prisma/index.js'));
fastify.register(import('./plugins/medbot/index.js'));

// TODO remove
// Declare a route
fastify.get('/', async function handler() {
  const products = await fastify.prisma.product.findMany();
  return products;
});

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
