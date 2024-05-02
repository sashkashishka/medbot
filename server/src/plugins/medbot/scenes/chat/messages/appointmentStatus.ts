import type { Prisma } from '@prisma/client';
import { formatDate } from '../../../../api/utils/time.js';

export const APPOINTMENT_STATUS_MESSAGES = {
  '/appointmentCreated': (
    appointment: Prisma.AppointmentUncheckedCreateInput,
  ) => {
    if (!appointment) return '';

    const date = formatDate(appointment.time, {
      timezoneOffset: appointment.timezoneOffset,
      timeZone: appointment.timeZone,
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

    const date = formatDate(appointment.time, {
      timezoneOffset: appointment.timezoneOffset,
      timeZone: appointment.timeZone,
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
