import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { isOccupied } from '../../utils/time.js';
import { AppointmentError } from '../../utils/errors.js';
import { addWeeks, startOfDay } from 'date-fns';

export const canCreateAppointment: preHandlerAsyncHookHandler =
  async function canCreateAppointment(request) {
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    const { time, orderId } = body;

    const appointments = await this.prisma.appointment.findMany({
      where: {
        orderId: Number(orderId),
      },
    });

    if (appointments.some((item) => item.status === 'ACTIVE')) {
      throw new AppointmentError('has-active');
    }

    if (
      !request.$order.subscriptionEndsAt &&
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
  };
