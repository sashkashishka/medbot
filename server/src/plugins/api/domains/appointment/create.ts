import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

import { createGoogleCalendarEvent } from '../../utils/google-calendar.js';
import { setAppointmentTimeToStartOfHour } from '../../hooks/preHandler/setAppointmentTimeToStartOfHour.js';
import { isAppointmentOutOfWorkingHours } from '../../hooks/preHandler/isAppointmentOutOfWorkingHours.js';
import { isAppointmentTooEarly } from '../../hooks/preHandler/isAppointmentTooEarly.js';
import { canCreateAppointment } from '../../hooks/preHandler/canCreateAppointment.js';
import { createDecorateWithOrder } from '../../hooks/preHandler/decorateWithOrder.js';

export const createAppointmentRoute: RouteOptions = {
  method: 'POST',
  url: '/appointment/create',
  schema: {
    body: {
      type: 'object',
      properties: {
        complaints: { type: 'string' },
        complaintsStarted: { type: 'string' },
        medicine: { type: 'string' },
        chronicDiseases: { type: 'string' },
        time: { type: 'string' },
        timezoneOffset: { type: 'number' },
        status: { type: 'string' },
        orderId: { type: 'number' },
        userId: { type: 'number' },
        report: { type: 'string' },
        treatment: { type: 'string' },
      },
      required: [
        'complaints',
        'complaintsStarted',
        'medicine',
        'chronicDiseases',
        'time',
        'timezoneOffset',
        'status',
        'orderId',
        'userId',
      ],
    },
  },
  preHandler: [
    setAppointmentTimeToStartOfHour,
    isAppointmentOutOfWorkingHours,
    isAppointmentTooEarly,
    createDecorateWithOrder('body'),
    canCreateAppointment,
  ],
  async handler(req) {
    const body = req.body as Prisma.AppointmentUncheckedCreateInput;

    const appointment = await this.prisma.appointment.create({
      data: body,
      select: {
        id: true,
        orderId: true,
        userId: true,
        complaints: true,
        complaintsStarted: true,
        medicine: true,
        chronicDiseases: true,
        time: true,
        timezoneOffset: true,
        status: true,
        user: true,
      },
    });

    const event = await this.googleCalendar.events.insert(
      createGoogleCalendarEvent({
        calendarId: this.config.GOOGLE_CALENDAR_ID,
        user: appointment.user,
        appointment: appointment,
      }),
    );

    return this.prisma.appointment.update({
      where: {
        id: appointment.id,
      },
      data: {
        calendarEventId: event.data.id,
      },
    });
  },
};
