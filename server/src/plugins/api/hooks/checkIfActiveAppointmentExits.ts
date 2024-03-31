import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { AppointmentError } from '../utils/errors.js';

export const checkIfActiveAppointmentExits: preHandlerAsyncHookHandler =
  async function checkIfActiveAppointmentExits(request) {
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    const { orderId } = body;

    const activeAppointments = await this.prisma.appointment.count({
      where: {
        orderId: Number(orderId),
        status: 'ACTIVE',
      },
    });

    if (activeAppointments > 0) {
      throw new AppointmentError('has-active');
    }
  };
