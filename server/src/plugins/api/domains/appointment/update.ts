import { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

import { createGoogleCalendarEvent } from '../../utils/google-calendar.js';
import { transformAppointmentTimeToStartOfHour } from '../../hooks/transformAppointmentTimeToStartOfHour.js';
import { checkIsAppointmentOutOfWorkingHours } from '../../hooks/checkIsAppointmentOutOfWorkingHours.js';
import { checkIsAppointmentTooEarly } from '../../hooks/checkIsAppointmentTooEarly.js';
import { checkIfCanUpdateNotActiveAppointment } from '../../hooks/checkIfCanUpdateNotActiveAppointment.js';
import { checkIfTimeSlotFree } from '../../hooks/checkIfTimeSlotFree.js';
import { checkIfAppointmentTimeBehindOrderExpirationDate } from '../../hooks/checkIfAppointmentTimeBehindOrderExpirationDate.js';
import { createDecorateWithOrder } from '../../hooks/decorateWithOrder.js';
import { checkIfSubscriptionOrderExpired } from '../../hooks/checkIfSubscriptionOrderExpired.js';

interface iParams {
  appointmentId: string;
}

export const updateAppointmentRoute: RouteOptions = {
  method: 'PATCH',
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
    params: {
      type: 'object',
      properties: {
        appointmentId: { type: 'number' },
      },
      required: ['appointmentId'],
    },
  },
  preHandler: [
    transformAppointmentTimeToStartOfHour,
    createDecorateWithOrder('body'),
    checkIfSubscriptionOrderExpired,
    checkIsAppointmentOutOfWorkingHours,
    checkIsAppointmentTooEarly,
    checkIfCanUpdateNotActiveAppointment,
    checkIfTimeSlotFree,
    checkIfAppointmentTimeBehindOrderExpirationDate,
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
        tgForumUrlTemplate: this.config.TG_BOT_FORUM_URL_TEMPLATE,
        adminAreaUrl: this.config.ADMIN_AREA_URL,
        eventId: appointment.calendarEventId,
        user: appointment.user,
        appointment: appointment,
      }),
    );

    delete appointment.user;

    return appointment;
  },
};
