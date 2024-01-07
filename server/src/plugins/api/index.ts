import fs from 'node:fs';
import path from 'node:path';
import type { FastifyPluginCallback } from 'fastify';

import { AppointmentError } from './utils/errors.js';

import { userRoute } from './domains/user/index.js';
import { createUserRoute } from './domains/user/create.js';
import { updateUserRoute } from './domains/user/update.js';

import { createProductRoute } from './domains/product/create.js';
import { productListRoute } from './domains/product/list.js';

import { activeOrderRoute } from './domains/order/active.js';
import { createOrderRoute } from './domains/order/create.js';
import { waitingForPaymentOrderRoute } from './domains/order/waitingForPayment.js';
import { updateOrderRoute } from './domains/order/update.js';

import { proceedToAppointmentRoute } from './domains/medbot/proceed-to-appointment.js';
import { proceedToChatRoute } from './domains/medbot/proceed-to-chat.js';

import { freeSlotsRoute } from './domains/appointment/free-slots.js';
import { createAppointmentRoute } from './domains/appointment/create.js';
import { updateAppointmentRoute } from './domains/appointment/update.js';
import { deleteAppointmentRoute } from './domains/appointment/delete.js';

import { preHandler } from './hooks.js';

const api: FastifyPluginCallback = (fastify, _opts, done) => {
  // TODO return back
  // fastify.addHook('preHandler', preHandler);

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
  fastify.route(proceedToChatRoute);
  fastify.route(createAppointmentRoute);
  fastify.route(updateAppointmentRoute);
  fastify.route(deleteAppointmentRoute);
  fastify.route(freeSlotsRoute);
  // fastify.route({
  //   method: 'get',
  //   url: '/calendar/callback',
  //   async handler(req) {
  //     const query = req.query;

  //     const r = await fastify.oAuth.getToken(query.code);

  //     fastify.oAuth.setCredentials(r.tokens);

  //     console.log('$$$$$$$$$$$$$$$$$$$$$$')
  //     console.log('$$$$$$$$$$$$$$$$$$$$$$')
  //     console.log('$$$$$$$$$$$$$$$$$$$$$$')
  //     console.log('$$$$$$$$$$$$$$$$$$$$$$')
  //     console.log(r.tokens)

  //     // fs.writeFileSync(
  //     //   path.resolve(__dirname, './token.json'),
  //     //   JSON.stringify(r.tokens),
  //     // );

  //     return r.tokens;
  //   },
  // });
  fastify.route({
    method: 'get',
    url: '/calendar/list',
    async handler(req) {
      const data = await fastify.googleCalendar.events.insert({
        calendarId: fastify.googleCalendarId,
        requestBody: {
          summary: 'Test ',
          start: {
            dateTime: '2023-12-15T09:00:00-07:00',
            timeZone: 'America/Los_Angeles',
          },
          end: {
            dateTime: '2023-12-15T10:00:00-07:00',
            timeZone: 'America/Los_Angeles',
          },
          conferenceData: {
            conferenceSolution: {
              key: {
                type: 'hangoutsMeet',
              },
            },
            createRequest: {
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
              requestId: '12345678',
            },
            entryPoints: [
              {
                entryPointType: 'more',
              },
            ],
          },
        },
        conferenceDataVersion: 1,
      });

      // const data = await fastify.googleCalendar.calendars.insert({
      //   requestBody: {
      //     summary: 'app test',
      //     conferenceProperties: {
      //       allowedConferenceSolutionTypes: ['hangoutsMeet'],
      //     },
      //   },
      // });

      // const data = await fastify.googleCalendar.calendars.get({
      //   calendarId: fastify.googleCalendarId,
      // });

      // const data = await fastify.googleCalendar.calendarList.insert({
      //   requestBody: {
      //     id: '8ee8e13aa42c33eb68c4edfeccaa26b021bfc7c0d089e557da4f92d747bddfe6@group.calendar.google.com',
      //     conferenceProperties: {
      //       allowedConferenceSolutionTypes: ['hangoutsMeet']
      //     }
      //   }
      // })

      return data.data;

      // const { data: finalData } = await fastify.googleCalendar.events.patch({
      //   calendarId: fastify.googleCalendarId,
      //   eventId: data.id,
      //   conferenceDataVersion: 1,
      //   requestBody: {
      //     conferenceData: {
      //       createRequest: {
      //         conferenceSolutionKey: {
      //           type: 'hangoutsMeet',
      //         },
      //         requestId: 'sdfsdfsdf',
      //       },
      //     },
      //   },
      // });
      // const r = await fastify.googleCalendar.calendarList.insert({
      //   requestBody: {
      //     id: '74327874cff4bb176f9b5415b1542222ea76953cf97c814ccb32c1e21006c5f7@group.calendar.google.com',
      //   },
      // });

      return {
        // r,
        // finalData,
      };
    },
  });

  fastify.setErrorHandler(function errorHandler(error, _req, reply) {
    this.log.error(error, 'api');

    if (error instanceof AppointmentError) {
      return reply.code(400).send(error.description);
    }

    return reply.status(400).send(error);
  });
  done();
};

export default api;
