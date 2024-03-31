import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { AppointmentError } from '../utils/errors.js';

export const checkIfOneTimeOrderHasDoneAppointments: preHandlerAsyncHookHandler =
  async function checkIfOneTimeOrderHasDoneAppointments(request) {
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    const { orderId } = body;

    const doneAppointments = await this.prisma.appointment.count({
      where: {
        orderId: Number(orderId),
        status: 'DONE',
      },
    });

    if (
      !request.$order.subscriptionEndsAt &&
      doneAppointments > 0
    ) {
      throw new AppointmentError('one-time-order-cannot-create-twice');
    }
  };
