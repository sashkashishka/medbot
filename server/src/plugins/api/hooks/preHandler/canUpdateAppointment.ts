import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { isOccupied } from '../../utils/time.js';
import { AppointmentError } from '../../utils/errors.js';
import { addWeeks, startOfDay } from 'date-fns';

export const canUpdateAppointment: preHandlerAsyncHookHandler =
  async function canUpdateAppointment(request) {
    const params = request.params as { appointmentId: string };
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    const { appointmentId } = params;
    const { time } = body;

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
  };
