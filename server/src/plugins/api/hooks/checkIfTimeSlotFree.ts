import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { AppointmentError } from '../utils/errors.js';

export const checkIfTimeSlotFree: preHandlerAsyncHookHandler =
  async function checkIfTimeSlotFree(request) {
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    const { time } = body;

    const count = await this.prisma.appointment.count({
      where: {
        status: 'ACTIVE',
        time: {
          equals: time,
        },
        ...(body.id
          ? {
              id: {
                not: Number(body.id),
              },
            }
          : {}),
      },
    });

    if (count > 0) {
      throw new AppointmentError('occupied');
    }
  };
