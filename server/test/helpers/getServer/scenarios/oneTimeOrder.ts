import { type FastifyInstance } from 'fastify';
import { user } from '../fixtures/user.js';

async function active(fastify: FastifyInstance) {
  const product = await fastify.prisma.product.findFirst({
    where: {
      subscriptionDuration: { equals: 0 },
    },
  });
  await fastify.prisma.order.create({
    data: {
      userId: user.id,
      productId: product.id,
      status: 'ACTIVE',
      createdAt: new Date(),
      subscriptionEndsAt: null,
    },
  });
}

async function waitingForPayment(fastify: FastifyInstance) {
  const product = await fastify.prisma.product.findFirst({
    where: {
      subscriptionDuration: { equals: 0 },
    },
  });
  await fastify.prisma.order.create({
    data: {
      userId: user.id,
      productId: product.id,
      status: 'WAITING_FOR_PAYMENT',
      createdAt: new Date(),
      subscriptionEndsAt: null,
    },
  });
}

export const ONE_TIME_ORDER = {
  active,
  waitingForPayment,
};
