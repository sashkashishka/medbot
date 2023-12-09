import type { FastifyPluginCallback } from 'fastify';

import { userRoute } from './user/index.js';
import { createUserRoute } from './user/create.js';

import { createProductRoute } from './product/create.js';
import { productListRoute } from './product/list.js';

import { activeOrderRoute } from './order/active.js';
import { createOrderRoute } from './order/create.js';
import { waitingForPaymentOrderRoute } from './order/waitingForPayment.js';

import { preHandler } from './hooks.js';

const api: FastifyPluginCallback = (fastify, _opts, done) => {
  // TODO return back
  fastify.addHook('preHandler', preHandler);

  fastify.get('/medbot', async (req) => {
    const urlParams = new URLSearchParams(
      req.headers['x-webapp-info'] as string,
    );

    const queryId = urlParams.get('query_id');

    return fastify.medbot.telegram.answerWebAppQuery(queryId, {
      id: '0',
      type: 'article',
      title: 'Hello Mini App!',
      input_message_content: {
        message_text: '/orderCompleted',
      },
    });
  });
  fastify.route(productListRoute);
  fastify.route(createProductRoute);
  fastify.route(userRoute);
  fastify.route(createUserRoute);
  fastify.route(activeOrderRoute);
  fastify.route(createOrderRoute);
  fastify.route(waitingForPaymentOrderRoute);

  fastify.setErrorHandler(function errorHandler(error, _req, reply) {
    this.log.error(error);

    return reply.status(400).send(error);
  });
  done();
};

export default api;
