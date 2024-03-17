import { addWeeks, startOfDay, startOfHour } from 'date-fns';
import { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

import { isEarly, isOccupied, isWithinWorkingHours } from '../../utils/time.js';
import { AppointmentError } from '../../utils/errors.js';
import { createGoogleCalendarEvent } from '../../utils/google-calendar.js';

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
        status: { type: 'string' },
        orderId: { type: 'number' },
        userId: { type: 'number' },
      },
      required: [
        'complaints',
        'complaintsStarted',
        'medicine',
        'chronicDiseases',
        'time',
        'status',
        'orderId',
        'userId',
      ],
    },
  },
  async preHandler(request) {
    const params = request.params as iParams;
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    body.time = startOfHour(new Date(body.time)).toISOString();

    const { appointmentId } = params;
    const { time } = body;

    if (!isWithinWorkingHours(time)) {
      throw new AppointmentError('out-of-working-hours');
    }

    if (isEarly(time)) {
      throw new AppointmentError('too-early');
    }

    const activeAppointment = await this.prisma.appointment.findFirst({
      where: {
        status: 'ACTIVE',
        id: Number(appointmentId),
        time: {
          gte: new Date().toISOString(),
        },
      },
    });

    if (!activeAppointment) {
      throw new AppointmentError('cannot-update-not-active-appointment');
    }

    const data = await this.prisma.appointment.findMany({
      where: {
        status: 'ACTIVE',
        time: {
          gte: new Date().toISOString(),
          lte: addWeeks(startOfDay(new Date()), 2).toISOString(),
        },
      },
    });

    data.forEach((appointment) => {
      if (
        isOccupied(time, appointment.time) &&
        appointment.id !== Number(appointmentId)
      ) {
        throw new AppointmentError('occupied');
      }
    });
  },
  async handler(request) {
    const params = request.params as iParams;
    const {
      status, // eslint-disable-line
      ...body
    } = request.body as Prisma.AppointmentUncheckedCreateInput;

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
