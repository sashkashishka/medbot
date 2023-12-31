import dayjs from 'dayjs';
import { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

import { logger } from '../../../../logger.js';
import { isEarly, isOccupied, isWithinWorkingHours } from '../../utils/time.js';
import { AppointmentError } from '../../utils/errors.js';

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

    body.time = dayjs(body.time).startOf('hour').toISOString();

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
          gte: dayjs().toISOString(),
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
          gte: dayjs().toISOString(),
          lte: dayjs().add(2, 'weeks').startOf('day').toISOString(),
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
  handler(request) {
    const params = request.params as iParams;
    const {
      status, // eslint-disable-line
      ...body
    } = request.body as Prisma.AppointmentUncheckedCreateInput;

    const { appointmentId } = params;

    return this.prisma.appointment.update({
      where: {
        id: Number(appointmentId),
        status: 'ACTIVE',
      },
      data: body,
    });
  },
};
