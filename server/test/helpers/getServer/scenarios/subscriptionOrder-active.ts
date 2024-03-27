import { type FastifyInstance } from 'fastify';
import { subscriptionOrder_active } from '../fixtures/subscriptionOrder-active.js';

export async function subscriptionOrderActive(fastify: FastifyInstance) {
  await fastify.prisma.order.create({
    data: subscriptionOrder_active,
  });
}
