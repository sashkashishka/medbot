import { addWeeks, startOfDay, startOfHour } from 'date-fns';
import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

import { AppointmentError } from '../../utils/errors.js';
import { isEarly, isOccupied, isWithinWorkingHours } from '../../utils/time.js';
import { createGoogleCalendarEvent } from '../../utils/google-calendar.js';

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
  async preHandler(request) {
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    body.time = startOfHour(new Date(body.time)).toISOString();

    const { time, orderId } = body;

    if (!isWithinWorkingHours(time)) {
      throw new AppointmentError('out-of-working-hours');
    }

    if (isEarly(time)) {
      throw new AppointmentError('too-early');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
    });

    const appointments = await this.prisma.appointment.findMany({
      where: {
        orderId: Number(orderId),
      },
    });

    if (appointments.some((item) => item.status === 'ACTIVE')) {
      throw new AppointmentError('has-active');
    }

    if (
      !order.subscriptionEndsAt &&
      appointments.some((item) => item.status === 'DONE')
    ) {
      throw new AppointmentError('one-time-order-cannot-create-twice');
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
      if (isOccupied(time, appointment.time)) {
        throw new AppointmentError('occupied');
      }
    });
  },
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
