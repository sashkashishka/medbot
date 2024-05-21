import type { Prisma } from '@prisma/client';
import { formatDate } from '../../../../../utils/time.js';
import type { iMedbotContext } from '../../../types.js';

interface iOptions {
  appointment: Prisma.AppointmentUncheckedCreateInput;
  user: Prisma.UserUncheckedCreateInput;
  $t: iMedbotContext['$t'];
}

export const APPOINTMENT_STATUS_MESSAGES = {
  '/appointmentCreated': ({ appointment, user, $t }: iOptions) => {
    if (!appointment) return '';

    const date = formatDate(appointment.time, {
      timezoneOffset: user.timezoneOffset,
      timeZone: user.timeZone,
    });

    return $t.get().appointmentCreated({ date });
  },
  '/appointmentUpdated': ({ appointment, user, $t }: iOptions) => {
    if (!appointment) return '';

    const date = formatDate(appointment.time, {
      timezoneOffset: user.timezoneOffset,
      timeZone: user.timeZone,
    });

    return $t.get().appointmentUpdated({ date });
  },
  '/appointmentDeleted': ({ $t }) => {
    return $t.get().appointmentDeleted;
  },
} as const;

export function completeAppointmentByDoctorMsg(
  order: Prisma.OrderUncheckedCreateInput,
  $t: iMedbotContext['$t'],
) {
  if (order.subscriptionEndsAt) {
    return $t.get().completeAppointmentSubscriptionOrder;
  }

  return $t.get().completeAppointmentOneTimeOrder;
}

export function deleteAppointmentByDoctorMsg($t: iMedbotContext['$t']) {
  return $t.get().appointmentDeleteByDoctor;
}
