import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { isWithinWorkingHours } from '../../../utils/time.js';
import { AppointmentError } from '../utils/errors.js';

export const checkIsAppointmentOutOfWorkingHours: preHandlerAsyncHookHandler =
  async function checkIsAppointmentOutOfWorkingHours(request) {
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    const { time } = body;

    if (!isWithinWorkingHours(time)) {
      throw new AppointmentError('out-of-working-hours');
    }
  };
