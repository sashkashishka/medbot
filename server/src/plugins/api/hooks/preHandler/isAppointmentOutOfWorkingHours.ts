import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { isWithinWorkingHours } from '../../utils/time.js';
import { AppointmentError } from '../../utils/errors.js';

export const isAppointmentOutOfWorkingHours: preHandlerAsyncHookHandler =
  async function isAppointmentOutOfWorkingHours(request) {
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    const { time } = body;

    if (!isWithinWorkingHours(time)) {
      throw new AppointmentError('out-of-working-hours');
    }
  };
