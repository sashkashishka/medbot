import { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

import { createGoogleCalendarEvent } from '../../utils/google-calendar.js';
import { setAppointmentTimeToStartOfHour } from '../../hooks/preHandler/setAppointmentTimeToStartOfHour.js';
import { isAppointmentOutOfWorkingHours } from '../../hooks/preHandler/isAppointmentOutOfWorkingHours.js';
import { isAppointmentTooEarly } from '../../hooks/preHandler/isAppointmentTooEarly.js';
import { canUpdateAppointment } from '../../hooks/preHandler/canUpdateAppointment.js';

interface iParams {
  appointmentId: string;
}

export const updateAppointmentRoute: RouteOptions = {
  method: 'PUT',
  url: '/appointment/:appointmentId',
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
    canUpdateAppointment,
  ],
  async handler(request) {
    const params = request.params as iParams;
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    const { appointmentId } = params;

    const appointment = await this.prisma.appointment.update({
      where: {
        id: Number(appointmentId),
        status: 'ACTIVE',
      },
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
        calendarEventId: true,
        user: true,
      },
    });

    await this.googleCalendar.events.update(
      createGoogleCalendarEvent({
        calendarId: this.config.GOOGLE_CALENDAR_ID,
        eventId: appointment.calendarEventId,
        user: appointment.user,
        appointment: appointment,
      }),
    );

    delete appointment.user;

    return appointment;
  },
};
