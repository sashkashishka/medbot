import { differenceInMinutes } from 'date-fns';
import { getUserId } from '../../../../utils/tg';

export const ORDER_ERRORS: Record<string, string> = {
  'has-active': `Ви вже маєте замовлення. Якщо бачите цю помилку, то надішліть будь ласка скріншот цього повідомлення на пошту medihelp.ua@gmail.com. userId: ${getUserId()}`,
  // 'cannot-update-not-active-order': `Ви не можете оновити закінчене замовлення. Якщо бачите цю помилку, то надішліть будь ласка скріншот цього повідомлення на пошту medihelp.ua@gmail.com. userId: ${getUserId()}`,
};

export const BLOCK_REASON: Record<string, (d: Date) => string> = {
  maxAttempts: () => `Забагато спроб. Заблоковано на 1 добу`,
  frequency: (date: Date) =>
    `Забагато спроб. Заблоковано на ${differenceInMinutes(
      date,
      new Date(),
    )} хвилин`,
};
