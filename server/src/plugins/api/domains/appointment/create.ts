import type { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import type { RouteOptions } from 'fastify';

import { AppointmentError } from '../../utils/errors.js';
import { isEarly, isOccupied, isWithinWorkingHours } from '../../utils/time.js';

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
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    body.time = dayjs(body.time).startOf('hour').toISOString();

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
          gte: dayjs().toISOString(),
          lte: dayjs().add(2, 'weeks').startOf('day').toISOString(),
        },
      },
    });

    data.forEach((appointment) => {
      if (isOccupied(time, appointment.time)) {
        throw new AppointmentError('occupied');
      }
    });
  },
  handler(req) {
    const body = req.body as Prisma.AppointmentUncheckedCreateInput;

    return this.prisma.appointment.create({
      data: body,
    });
  },
};
