import { type FastifyPluginCallback } from 'fastify';

import { createProgressiveDelay } from './utils/progressive-delay.js';

import { userRoute } from './domains/user/index.js';
import { createUserRoute } from './domains/user/create.js';
import { updateUserRoute } from './domains/user/update.js';
import { userListRoute } from './domains/user/list.js';

import { createProductRoute } from './domains/product/create.js';
import { productListRoute } from './domains/product/list.js';
import { editProductRoute } from './domains/product/edit.js';
import { deleteProductRoute } from './domains/product/delete.js';
import { productRoute } from './domains/product/index.js';

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
import { checkOrderActiveRoute } from './domains/medbot/checkOrderActive.js';
import { ordersProductRoute } from './domains/medbot/ordersProduct.js';
import { tgCompleteOrderRoute } from './domains/medbot/tgCompleteOrder.js';
import { tgDeleteAppointmentRoute } from './domains/medbot/tgDeleteAppointment.js';
import { tgCompleteAppointmentRoute } from './domains/medbot/tgCompleteAppointment.js';

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

import { validateIsMedbot } from './hooks/validateIsMedbot.js';
import { validateIsWebapp } from './hooks/validateIsWebapp.js';
import { errorHandler } from './hooks/errorHandler.js';

declare module 'fastify' {
  // eslint-disable-next-line
  interface FastifyInstance {
    rateLimiter: ReturnType<typeof createProgressiveDelay>;
  }
}

const userApi: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook('onRequest', validateIsWebapp);

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

  fastify.setErrorHandler(errorHandler);
  done();
};

const serviceApi: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook('onRequest', validateIsMedbot);
  fastify.route(teardownUserDataRoute);
  fastify.route(botChatIdRoute);
  fastify.route(messageThreadIdRoute);
  fastify.route(activeOrderRoute);
  fastify.route(activeAppointmentRoute);
  fastify.route(userRoute);
  fastify.route(updateUserRoute);
  fastify.route(productRoute);
  fastify.route(checkOrderActiveRoute);
  fastify.route(ordersProductRoute);

  fastify.setErrorHandler(errorHandler);
  done();
};

const adminAuthApi: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.route(registerAdminRoute);
  fastify.route(loginAdminRoute);
  fastify.route(logoutAdminRoute);

  fastify.setErrorHandler(errorHandler);
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
  fastify.route(freeSlotsRoute);
  fastify.route(deleteAppointmentRoute);
  fastify.route(completeOrderRoute);
  fastify.route(tgCompleteOrderRoute);
  fastify.route(tgCompleteAppointmentRoute);
  fastify.route(tgDeleteAppointmentRoute);

  fastify.setErrorHandler(errorHandler);

  done();
};

export const apiPlugin: FastifyPluginCallback = async (fastify) => {
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
};
