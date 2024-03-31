import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { AppointmentError } from '../utils/errors.js';
import { isAfter } from 'date-fns';

export const checkIfAppointmentTimeBehindOrderExpirationDate: preHandlerAsyncHookHandler =
  async function checkIfAppointmentTimeBehindOrderExpirationDate(request) {
    const body = request.body as Prisma.AppointmentUncheckedCreateInput;

    const { time } = body;

    const { subscriptionEndsAt } = request.$order || {};

    if (!subscriptionEndsAt) return;

    if (isAfter(new Date(time), new Date(subscriptionEndsAt))) {
      throw new AppointmentError(
        'cannot-create-appointment-behind-order-expiration-date',
      );
    }
  };
