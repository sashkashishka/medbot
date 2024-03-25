import { addMinutes, format } from 'date-fns';
import type { iAppointment, iOrder } from '../types';
import uk from 'date-fns/locale/uk';

export function getOrderCompleteMessage() {
  return `Дякуємо за ваше замовлення. Лікар закрив його. Щоб отримати консультацію ще раз - натисніть кнопку "Замовити"`;
}

export function getAppointmentChangeTimeMessage(appointment: iAppointment) {
  const timezoneDate = addMinutes(
    new Date(appointment.time),
    -appointment.timezoneOffset,
  );

  return `Лікар змінив час візиту. Запланована дата ${format(timezoneDate, 'HH:mm eeee, dd.LL.yyyy', { locale: uk })}.`;
}

export function getAppointmentDeleteMessage() {
  return `Лікар відмінив зустріч.`;
}

export function getAppointmentCompleteMessage({
  activeOrder,
}: {
  activeOrder: iOrder;
}) {
  if (activeOrder.subscriptionEndsAt) {
    return `Дякуємо за візит. Ви можете назначити новий натиснувши кнопку "Запис"`;
  }

  return `Дякуємо за візит. На жаль, за обраною послугою ви не можете знову записатись на прийом, але можете писати і отримувати повідомлення від лікаря, поки ваше замовлення лікар не закінчить.`;
}
