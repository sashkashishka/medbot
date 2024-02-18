import { getUserId } from '../../../../utils/tg';

export const ORDER_ERRORS: Record<string, string> = {
  'has-active': `Ви вже маєте замовлення. Якщо бачите цю помилку, то надішліть будь ласка скріншот цього повідомлення на пошту medihelp.ua@gmail.com. userId: ${getUserId()}`,
  'cannot-update-not-active-order': `Ви не можете оновити закінчене замовлення. Якщо бачите цю помилку, то надішліть будь ласка скріншот цього повідомлення на пошту medihelp.ua@gmail.com. userId: ${getUserId()}`,
};
