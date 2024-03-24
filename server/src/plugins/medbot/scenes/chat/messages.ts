import type { Prisma } from '@prisma/client';
import { addMinutes } from 'date-fns';
import { formatDate } from '../../../api/utils/time.js';

export const MESSAGES = {
  APPOINTMENT: `Дякуємо за ваше замовлення! Залишилось назначити зустріч`,
  CHAT: `Зустріч назначено. Можете відправити свої документи в чат`,
  APPOINTMENT_STATUS: {
    '/appointmentCreated': (
      appointment: Prisma.AppointmentUncheckedCreateInput,
    ) => {
      if (!appointment) return '';

      const timezoneDate = addMinutes(
        new Date(appointment.time),
        -appointment.timezoneOffset,
      );

      return `Зустріч з лікарем запланована на ${formatDate(timezoneDate, {
        formatStr: 'hour-day-date-month-year',
      })}.`;
    },
    '/appointmentUpdated': (
      appointment: Prisma.AppointmentUncheckedCreateInput,
    ) => {
      if (!appointment) return '';

      const timezoneDate = addMinutes(
        new Date(appointment.time),
        -appointment.timezoneOffset,
      );

      return `Зустріч з лікарем була змінена. Запланована дата ${formatDate(
        timezoneDate,
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
