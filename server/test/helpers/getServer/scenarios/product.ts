import { type FastifyInstance } from 'fastify';
import { products } from '../fixtures/products.js';

export async function product(fastify: FastifyInstance) {
  await fastify.prisma.product.createMany({
    data: products,
  });
}
