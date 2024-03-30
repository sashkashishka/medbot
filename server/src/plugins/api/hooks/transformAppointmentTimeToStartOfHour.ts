import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { startOfHour } from 'date-fns';

export const transformAppointmentTimeToStartOfHour: preHandlerAsyncHookHandler =
  async function transformAppointmentTimeToStartOfHour(request) {
    const { time } = request.body as Prisma.AppointmentUncheckedCreateInput;

    (request.body as Prisma.AppointmentUncheckedCreateInput).time = startOfHour(
      new Date(time),
    ).toISOString();
  };
