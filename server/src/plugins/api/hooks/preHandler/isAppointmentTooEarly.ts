import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { isEarly } from '../../utils/time.js';
import { AppointmentError } from '../../utils/errors.js';

export const isAppointmentTooEarly: preHandlerAsyncHookHandler =
  async function isAppointmentTooEarly(request) {
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    const { time } = body;

    if (isEarly(time)) {
      throw new AppointmentError('too-early');
    }
  };
