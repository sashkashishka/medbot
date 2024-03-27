import { type FastifyPluginCallback } from 'fastify';

import {
  AppointmentError,
  OrderError,
  RegisterError,
  UserError,
  create400Response,
} from './utils/errors.js';
import { createProgressiveDelay } from './utils/progressive-delay.js';

import { userRoute } from './domains/user/index.js';
import { createUserRoute } from './domains/user/create.js';
import { updateUserRoute } from './domains/user/update.js';
import { userListRoute } from './domains/user/list.js';

import { createProductRoute } from './domains/product/create.js';
import { productListRoute } from './domains/product/list.js';
import { editProductRoute } from './domains/product/edit.js';
import { deleteProductRoute } from './domains/product/delete.js';

import { activeOrderRoute } from './domains/order/active.js';
import { createOrderRoute } from './domains/order/create.js';
import { waitingForPaymentOrderRoute } from './domains/order/waitingForPayment.js';
import { updateOrderRoute } from './domains/order/update.js';
import { createByCode } from './domains/order/createByCode.js';
import { orderListRoute } from './domains/order/list.js';
import { completeOrderRoute } from './domains/order/complete.js';

import { sendAppointmentStatusRoute } from './domains/medbot/sendAppointmentStatus.js';
import { proceedToChatRoute } from './domains/medbot/proceedToChat.js';
import { botChatIdRoute } from './domains/medbot/botChatId.js';
import { messageThreadIdRoute } from './domains/medbot/messageThreadId.js';
import { teardownUserDataRoute } from './domains/medbot/teardownUserData.js';
import { sendMessageRoute } from './domains/medbot/sendMessage.js';

import { freeSlotsRoute } from './domains/appointment/freeSlots.js';
import { createAppointmentRoute } from './domains/appointment/create.js';
import { activeAppointmentRoute } from './domains/appointment/active.js';
import { updateAppointmentRoute } from './domains/appointment/update.js';
import { deleteAppointmentRoute } from './domains/appointment/delete.js';
import { appointmentListRoute } from './domains/appointment/list.js';

import { registerAdminRoute } from './domains/admin/register.js';
import { loginAdminRoute } from './domains/admin/login.js';
import { logoutAdminRoute } from './domains/admin/logout.js';
import { adminRoute } from './domains/admin/admin.js';
import { adminConfigRoute } from './domains/admin/config.js';

import { verifyIsFromTg } from './hooks/preHandler/verifyIsFromTg.js';
import { tgHashValidator } from './hooks/preHandler/tgHashValidator.js';

declare module 'fastify' {
  // eslint-disable-next-line
  interface FastifyInstance {
    rateLimiter: ReturnType<typeof createProgressiveDelay>;
  }
}

const userApi: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook('preHandler', tgHashValidator);

  fastify.route(productListRoute);
  fastify.route(userRoute);
  fastify.route(createUserRoute);
  fastify.route(activeOrderRoute);
  fastify.route(createOrderRoute);
  fastify.route(updateOrderRoute);
  fastify.route(createByCode);
  fastify.route(waitingForPaymentOrderRoute);
  fastify.route(updateUserRoute);
  fastify.route(sendAppointmentStatusRoute);
  fastify.route(proceedToChatRoute);
  fastify.route(createAppointmentRoute);
  fastify.route(activeAppointmentRoute);
  fastify.route(updateAppointmentRoute);
  fastify.route(deleteAppointmentRoute);
  fastify.route(freeSlotsRoute);

  fastify.setErrorHandler(function errorHandler(error, _req, reply) {
    this.log.error(error, 'userApi');

    if (error instanceof UserError) {
      return reply.code(400).send(error.description);
    }

    if (error instanceof AppointmentError) {
      return reply.code(400).send(error.description);
    }

    if (error instanceof OrderError) {
      return reply.code(400).send(error.description);
    }

    return reply.status(error?.statusCode || 500).send(error);
  });

  done();
};

const serviceApi: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook('preHandler', verifyIsFromTg);
  fastify.route(teardownUserDataRoute);
  fastify.route(botChatIdRoute);
  fastify.route(messageThreadIdRoute);
  fastify.route(activeOrderRoute);
  fastify.route(activeAppointmentRoute);
  fastify.route(userRoute);
  fastify.route(updateUserRoute);

  fastify.setErrorHandler(function errorHandler(error, _req, reply) {
    this.log.error(error, 'serviceApi');

    return reply
      .status(error?.statusCode || 500)
      .send(create400Response({ error }));
  });

  done();
};

const adminAuthApi: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.route(registerAdminRoute);
  fastify.route(loginAdminRoute);
  fastify.route(logoutAdminRoute);

  fastify.setErrorHandler(function errorHandler(error, _req, reply) {
    this.log.error(error, 'adminAuthApi');

    if (error instanceof RegisterError) {
      return reply.code(400).send(error.description);
    }

    return reply.code(error?.statusCode || 500).send(error);
  });

  done();
};

const adminApi: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook('onRequest', (req) => req.jwtVerify());
  fastify.route(createProductRoute);
  fastify.route(editProductRoute);
  fastify.route(deleteProductRoute);
  fastify.route(productListRoute);
  fastify.route(userListRoute);
  fastify.route(orderListRoute);
  fastify.route(adminRoute);
  fastify.route(appointmentListRoute);
  fastify.route(adminConfigRoute);
  fastify.route(userRoute);
  fastify.route(updateAppointmentRoute);
  fastify.route(activeOrderRoute);
  fastify.route(updateOrderRoute);
  fastify.route(sendMessageRoute);
  fastify.route(freeSlotsRoute);
  fastify.route(deleteAppointmentRoute);
  fastify.route(completeOrderRoute);

  fastify.setErrorHandler(function errorHandler(error, _req, reply) {
    this.log.error(error, 'adminApi');

    if (error instanceof OrderError) {
      return reply.code(400).send(error.description);
    }

    return reply.code(error.statusCode || 500).send(error);
  });

  done();
};

export const apiPlugin: FastifyPluginCallback = async (
  fastify,
  _opts,
  done,
) => {
  fastify.decorate(
    'rateLimiter',
    createProgressiveDelay({
      // TODO: move this to .env variables
      cacheCapacity: 100,
      frequencyRate: 3,
      frequencyTime: 8000,
      maxAttempts: 20,
    }),
  );
  await fastify.register(userApi);
  await fastify.register(serviceApi, { prefix: '/service' });
  await fastify.register(adminAuthApi, { prefix: '/auth/admin' });
  await fastify.register(adminApi, { prefix: '/admin' });

  done();
};
