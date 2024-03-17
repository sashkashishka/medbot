import type { Prisma } from '@prisma/client';
import { formatDate } from '../../../api/utils/time.js';

export const MESSAGES = {
  APPOINTMENT: `Дякуємо за ваше замовлення! Залишилось назначити зустріч`,
  CHAT: `Зустріч назначено. Можете відправити свої документи в чат`,
  APPOINTMENT_STATUS: {
    '/appointmentCreated': (
      appointment: Prisma.AppointmentUncheckedCreateInput,
    ) => {
      if (!appointment) return '';

      return `Зустріч з лікарем запланована на ${formatDate(appointment.time, {
        formatStr: 'hour-day-date-month-year',
      })}.`;
    },
    '/appointmentUpdated': (
      appointment: Prisma.AppointmentUncheckedCreateInput,
    ) => {
      if (!appointment) return '';

      return `Зустріч з лікарем була змінена. Запланована дата ${formatDate(
        appointment.time,
        {
          formatStr: 'hour-day-date-month-year',
        },
      )}`;
    },
    '/appointmentDeleted': () => {
      return `Зустріч з лікарем була відмінена.`;
    },
  },
} as const;
