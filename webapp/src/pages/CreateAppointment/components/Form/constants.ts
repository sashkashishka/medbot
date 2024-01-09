export const APPOINTMENT_ERRORS: Record<string, string> = {
  'too-early': 'Оберіть пізніший час візиту',
  occupied: 'Цей час вже зайнятий. Оберіть іншу годину',
  'has-active':
    'Ви вже маєте запис. Якщо хочете створити новий, то видаліть попередній зі списку або змініть в ньому час візиту',
  'out-of-working-hours':
    'Ви обрали час поза робочими годинами. Оберіть ті що є в списку',
  'cannot-delete-not-active-appointment': 'Неможливо видалити минулий візит',
  'cannot-update-not-active-appointment': 'Неможливо змінити минулий візит',
  'one-time-order-cannot-create-twice':
    'Ви вже мали візит у лікаря. Для того, щоб записатись ще раз - замовте і сплатіть нову консультацію',
};
