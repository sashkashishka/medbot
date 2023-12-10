import type { FastifyPluginCallback } from 'fastify';

import { userRoute } from './user/index.js';
import { createUserRoute } from './user/create.js';
import { updateUserRoute } from './user/update.js';

import { createProductRoute } from './product/create.js';
import { productListRoute } from './product/list.js';

import { activeOrderRoute } from './order/active.js';
import { createOrderRoute } from './order/create.js';
import { waitingForPaymentOrderRoute } from './order/waitingForPayment.js';
import { updateOrderRoute } from './order/update.js';

import { proceedToAppointmentRoute } from './medbot/proceed-to-appointment.js';

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
  fastify.route(proceedToAppointmentRoute);

  fastify.setErrorHandler(function errorHandler(error, _req, reply) {
    this.log.error(error);

    return reply.status(400).send(error);
  });
  done();
};

export default api;
