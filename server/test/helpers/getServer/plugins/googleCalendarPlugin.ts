import { calendar_v3 } from '@googleapis/calendar';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

export const googleCalendarPluginMock: FastifyPluginAsync = fp(
  async (fastify) => {
    fastify.decorate('googleCalendar', {
      events: { update() {}, delete() {}, insert() {} },
    } as calendar_v3.Calendar);
  },
);
