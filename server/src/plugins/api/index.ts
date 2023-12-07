import type { FastifyPluginCallback } from 'fastify';
import { productListRoute } from './product/list.js';
import { userRoute } from './user/index.js';
import { createUserRoute } from './user/create.js';
import { activeOrderRoute } from './order/active.js';
import { createProductRoute } from './product/create.js';
import { preHandler } from './hooks.js';

const api: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook('preHandler', preHandler);

  fastify.route(productListRoute);
  fastify.route(createProductRoute)
  fastify.route(userRoute);
  fastify.route(createUserRoute);
  fastify.route(activeOrderRoute);

  fastify.setErrorHandler(function errorHandler(error, _req, reply) {
    this.log.error(error);

    return reply
      .status(400)
      .send(error);
  });
  done();
};

export default api;
