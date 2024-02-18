import type { FastifyPluginCallback } from 'fastify';

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

import { sendAppointmentStatusRoute } from './domains/medbot/send-appointment-status.js';
import { proceedToChatRoute } from './domains/medbot/proceed-to-chat.js';

import { freeSlotsRoute } from './domains/appointment/free-slots.js';
import { createAppointmentRoute } from './domains/appointment/create.js';
import { activeAppointmentRoute } from './domains/appointment/active.js';
import { updateAppointmentRoute } from './domains/appointment/update.js';
import { deleteAppointmentRoute } from './domains/appointment/delete.js';

import { preHandler } from './hooks.js';

const api: FastifyPluginCallback = (fastify, _opts, done) => {
  // TODO return back
  fastify.addHook('preHandler', preHandler);

  fastify.route(productListRoute);
  fastify.route(createProductRoute);
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
    this.log.error(error, 'api');

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

export default api;
