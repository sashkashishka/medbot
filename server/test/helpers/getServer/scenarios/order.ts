import { addHours, addMonths } from 'date-fns';
import type { Prisma } from '@prisma/client';
import type { FastifyInstance } from 'fastify';

export interface iOrderMock {
  userId: number;
  type: 'none' | 'one-time' | 'subscription';
  status: Prisma.OrderUncheckedCreateInput['status'];
  appointment: 'none' | 'active' | 'done';
}

export async function order(
  fastify: FastifyInstance,
  { userId, type, status, appointment }: iOrderMock,
) {
  if (type === 'none') return;

  const query =
    type === 'one-time'
      ? {
          subscriptionDuration: { equals: 0 },
        }
      : {
          subscriptionDuration: { not: 0 },
        };

  const product = await fastify.prisma.product.findFirst({
    where: query,
  });

  const order = await fastify.prisma.order.create({
    data: {
      userId: userId,
      productId: product.id,
      status: status,
      createdAt: new Date(),
      subscriptionEndsAt: product.subscriptionDuration
        ? addMonths(new Date(), product.subscriptionDuration)
        : null,
    },
  });

  const appointmentStatus = appointment === 'active' ? 'ACTIVE' : 'DONE';

  if (appointment === 'none') return;

  await fastify.prisma.appointment.create({
    data: {
      orderId: order.id,
      userId: userId,
      time: addHours(new Date(), 2 + userId),
      status: appointmentStatus,
      complaints: 'test',
      complaintsStarted: '1',
      chronicDiseases: 'test',
      medicine: 'test',
      timezoneOffset: 0,
    },
  });
}
