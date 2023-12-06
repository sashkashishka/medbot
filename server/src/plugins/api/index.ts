import type { FastifyPluginCallback } from 'fastify';
import { productListRoute } from './product/list.js';
// import { addProductRoute } from './product/add.js';

const api: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.route(productListRoute);
  // fastify.route(addProductRoute);

  fastify.setErrorHandler(function errorHandler(error, _req, reply) {
    this.log.error(error);

    return reply
      .status(400)
      .send(error);
  });
  done();
};

export default api;
