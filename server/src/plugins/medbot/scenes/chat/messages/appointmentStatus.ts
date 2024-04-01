import type { Prisma } from '@prisma/client';
import { addMinutes } from 'date-fns';
import { formatDate } from '../../../../api/utils/time.js';

export const APPOINTMENT_STATUS_MESSAGES = {
  '/appointmentCreated': (
    appointment: Prisma.AppointmentUncheckedCreateInput,
  ) => {
    if (!appointment) return '';

    const timezoneDate = addMinutes(
      new Date(appointment.time),
      -appointment.timezoneOffset,
    );

    const date = formatDate(timezoneDate, {
      formatStr: 'hour-day-date-month-year',
    });

    return (
      `Зустріч з лікарем запланована на ${date}.\n` +
      'Зустріч буде проводитися в онлайн форматі.\n' +
      'Тривалість - 45 хвилин.\n' +
      'Перед цим вам буде надіслано посилання на Google Meet.\n' +
      'Для більш предметної консультації надішліть всі ваші попередні обстеження та аналізи тут в чаті.'
    );
  },
  '/appointmentUpdated': (
    appointment: Prisma.AppointmentUncheckedCreateInput,
  ) => {
    if (!appointment) return '';

    const timezoneDate = addMinutes(
      new Date(appointment.time),
      -appointment.timezoneOffset,
    );

    const date = formatDate(timezoneDate, {
      formatStr: 'hour-day-date-month-year',
    });

    return (
      `Зустріч з лікарем була змінена. Запланована дата ${date}.\n` +
      'Зустріч буде проводитися в онлайн форматі.\n' +
      'Тривалість - 45 хвилин.\n' +
      'Перед цим вам буде надіслано посилання на Google Meet\n' +
      'Для більш предметної консультації не забудьте надіслати всі ваші попередні обстеження та аналізи тут в чаті.'
    );
  },
  '/appointmentDeleted': () => {
    return `Зустріч з лікарем була відмінена. Але ви завжди можете записатися на нову зустріч.`;
  },
} as const;
