import { type FastifyInstance } from 'fastify';
import { oneTimeOrder_active } from '../fixtures/oneTimeOrder-active.js';

export async function oneTimeOrderActive(fastify: FastifyInstance) {
  await fastify.prisma.order.create({
    data: oneTimeOrder_active,
  });
}
