import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

import { createGoogleCalendarEvent } from '../../utils/google-calendar.js';
import { transformAppointmentTimeToStartOfHour } from '../../hooks/transformAppointmentTimeToStartOfHour.js';
import { checkIsAppointmentOutOfWorkingHours } from '../../hooks/checkIsAppointmentOutOfWorkingHours.js';
import { checkIsAppointmentTooEarly } from '../../hooks/checkIsAppointmentTooEarly.js';
import { createDecorateWithOrder } from '../../hooks/decorateWithOrder.js';
import { checkIfActiveAppointmentExits } from '../../hooks/checkIfActiveAppointmentExits.js';
import { checkIfOneTimeOrderHasDoneAppointments } from '../../hooks/checkIfOneTimeOrderHasDoneAppointments.js';
import { checkIfTimeSlotFree } from '../../hooks/checkIfTimeSlotFree.js';
import { checkIsDoneOrder } from '../../hooks/checkIsDoneOrder.js';

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
    transformAppointmentTimeToStartOfHour,
    checkIsAppointmentOutOfWorkingHours,
    checkIsAppointmentTooEarly,
    createDecorateWithOrder('body'),
    checkIsDoneOrder,
    checkIfActiveAppointmentExits,
    checkIfOneTimeOrderHasDoneAppointments,
    checkIfTimeSlotFree,
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
