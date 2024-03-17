import { type FastifyPluginCallback } from 'fastify';

import {
  AppointmentError,
  OrderError,
  create400Response,
} from './utils/errors.js';

import { userRoute } from './domains/user/index.js';
import { createUserRoute } from './domains/user/create.js';
import { updateUserRoute } from './domains/user/update.js';

import { createProductRoute } from './domains/product/create.js';
import { productListRoute } from './domains/product/list.js';

import { activeOrderRoute } from './domains/order/active.js';
import { createOrderRoute } from './domains/order/create.js';
import { waitingForPaymentOrderRoute } from './domains/order/waitingForPayment.js';
import { updateOrderRoute } from './domains/order/update.js';

import { sendAppointmentStatusRoute } from './domains/medbot/sendAppointmentStatus.js';
import { proceedToChatRoute } from './domains/medbot/proceedToChat.js';
import { botChatIdRoute } from './domains/medbot/botChatId.js';
import { messageThreadIdRoute } from './domains/medbot/messageThreadId.js';
import { teardownUserDataRoute } from './domains/medbot/teardownUserData.js';

import { freeSlotsRoute } from './domains/appointment/freeSlots.js';
import { createAppointmentRoute } from './domains/appointment/create.js';
import { activeAppointmentRoute } from './domains/appointment/active.js';
import { updateAppointmentRoute } from './domains/appointment/update.js';
import { deleteAppointmentRoute } from './domains/appointment/delete.js';

import { tgHashValidator, verifyIsFromTg, verifyJwt } from './hooks.js';

const userApi: FastifyPluginCallback = (fastify, _opts, done) => {
  // TODO return back
  fastify.addHook('preHandler', tgHashValidator);

  fastify.route(productListRoute);
  fastify.route(userRoute);
  fastify.route(createUserRoute);
  fastify.route(activeOrderRoute);
  fastify.route(createOrderRoute);
  fastify.route(updateOrderRoute);
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

    if (error instanceof AppointmentError) {
      return reply.code(400).send(error.description);
    }

    if (error instanceof OrderError) {
      return reply.code(400).send(error.description);
    }

    return reply.status(400).send(create400Response({ error }));
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

  done();
};

const adminApi: FastifyPluginCallback = (fastify, _opts, done) => {
  // TODO verify token as from admin area
  fastify.addHook('preHandler', verifyJwt);
  fastify.route(createProductRoute);

  fastify.setErrorHandler(function errorHandler(error, _req, reply) {
    this.log.error(error, 'adminApi');

    return reply.status(400).send(create400Response({ error }));
  });

  done();
};

export const apiPlugin: FastifyPluginCallback = async (
  fastify,
  _opts,
  done,
) => {
  await fastify.register(userApi);
  await fastify.register(serviceApi, { prefix: '/service' });
  await fastify.register(adminApi);

  done();
};
