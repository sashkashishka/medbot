import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { startOfHour } from 'date-fns';

export const setAppointmentTimeToStartOfHour: preHandlerAsyncHookHandler =
  async function setAppointmentTimeToStartOfHour(request) {
    const { time } = request.body as Prisma.AppointmentUncheckedCreateInput;

    (request.body as Prisma.AppointmentUncheckedCreateInput).time = startOfHour(
      new Date(time),
    ).toISOString();
  };
