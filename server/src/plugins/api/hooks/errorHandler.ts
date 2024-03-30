import type { Prisma } from '@prisma/client';
import type { FastifyError, FastifyInstance } from 'fastify';
import {
  AppointmentError,
  OrderError,
  RegisterError,
  SubscriptionOrderExpired,
  UserError,
} from '../utils/errors.js';
import { teardownUserDataRoute } from '../domains/medbot/teardownUserData.js';

type tSetErrorHandlerParams = Parameters<FastifyInstance['setErrorHandler']>;

export const errorHandler: tSetErrorHandlerParams[0] =
  async function errorHandler(error: FastifyError, _req, reply) {
    this.log.error(error, 'apiPlugin');

    if (error instanceof RegisterError) {
      return reply.code(400).send(error.description);
    }

    if (error instanceof UserError) {
      return reply.code(400).send(error.description);
    }

    if (error instanceof AppointmentError) {
      return reply.code(400).send(error.description);
    }

    if (error instanceof OrderError) {
      return reply.code(400).send(error.description);
    }

    if (error instanceof SubscriptionOrderExpired) {
      const order: Prisma.OrderUncheckedCreateInput = error.order;

      await teardownUserDataRoute.handler.apply(this, [
        { params: { userId: order.userId } },
        {},
      ]);

      return reply.code(200).send({ message: 'subscription-order-completed' });
    }

    return reply.status(error?.statusCode || 500).send(error);
  };
