import { type FastifyInstance } from 'fastify';
import { user } from '../fixtures/user.js';
import { addMonths } from 'date-fns';

async function done(fastify: FastifyInstance) {
  const product = await fastify.prisma.product.findFirst({
    where: {
      subscriptionDuration: { gt: 0 },
    },
  });

  return await fastify.prisma.order.create({
    data: {
      userId: user.id,
      productId: product.id,
      status: 'DONE',
      createdAt: new Date(),
      subscriptionEndsAt: addMonths(new Date(), product.subscriptionDuration)
    },
  });
}

async function active(fastify: FastifyInstance) {
  const product = await fastify.prisma.product.findFirst({
    where: {
      subscriptionDuration: { gt: 0 },
    },
  });

  return await fastify.prisma.order.create({
    data: {
      userId: user.id,
      productId: product.id,
      status: 'ACTIVE',
      createdAt: new Date(),
      subscriptionEndsAt: addMonths(new Date(), product.subscriptionDuration)
    },
  });
}

async function waitingForPayment(fastify: FastifyInstance) {
  const product = await fastify.prisma.product.findFirst({
    where: {
      subscriptionDuration: { gt: 0 },
    },
  });
  await fastify.prisma.order.create({
    data: {
      userId: user.id,
      productId: product.id,
      status: 'WAITING_FOR_PAYMENT',
      createdAt: new Date(),
      subscriptionEndsAt: addMonths(new Date(), product.subscriptionDuration)
    },
  });
}

async function activeWithAppointments(fastify: FastifyInstance) {
  const order = await active(fastify);

  await fastify.prisma.appointment.create({
    data: {
      orderId: order.id,
      userId: user.id,
      time: new Date(),
      status: 'ACTIVE',
      complaints: 'test',
      complaintsStarted: '1',
      chronicDiseases: 'test',
      medicine: 'test',
      timezoneOffset: 0,
    },
  });
}

export const SUBSCRIPTION_ORDER = {
  active,
  activeWithAppointments,
  waitingForPayment,
  done,
};
