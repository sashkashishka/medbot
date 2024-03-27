import fp from 'fastify-plugin';
import { type FastifyPluginAsync } from 'fastify';
import { calendar, auth, type calendar_v3 } from '@googleapis/calendar';

declare module 'fastify' {
  // eslint-disable-next-line
  interface FastifyInstance {
    googleCalendar: calendar_v3.Calendar;
  }
}

export const googleCalendarPlugin: FastifyPluginAsync = fp(async (server) => {
  const jwt = new auth.JWT({
    email: server.config.GOOGLE_CALENDAR_SERVICE_ACCOUNT,
    key: server.config.GOOGLE_CALENDAR_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const googleCalendar = calendar({
    auth: jwt,
    version: 'v3',
  });

  server.decorate('googleCalendar', googleCalendar);
});
