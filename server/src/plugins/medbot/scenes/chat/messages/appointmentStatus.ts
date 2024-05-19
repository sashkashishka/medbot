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

    return $t.get().appointmentCreated({ date })
  },
  '/appointmentUpdated': ({ appointment, user, $t }: iOptions) => {
    if (!appointment) return '';

    const date = formatDate(appointment.time, {
      timezoneOffset: user.timezoneOffset,
      timeZone: user.timeZone,
    });

    return $t.get().appointmentUpdated({ date })
  },
  '/appointmentDeleted': ({ $t }) => {
    return $t.get().appointmentDeleted;
  },
} as const;

export function completeAppointmentByDoctorMsg(
  order: Prisma.OrderUncheckedCreateInput,
) {
  if (order.subscriptionEndsAt) {
    return `Дякуємо за візит. Ви можете назначити новий натиснувши кнопку "Запис"`;
  }

  return `Дякуємо за візит. На жаль, за обраною послугою ви не можете знову записатись на прийом, але можете писати і отримувати повідомлення від лікаря, поки ваше замовлення лікар не закінчить.`;
}

export function deleteAppointmentByDoctorMsg() {
  return `Лікар відмінив зустріч.`;
}
