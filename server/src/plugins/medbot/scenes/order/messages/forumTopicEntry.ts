import type { Prisma } from '@prisma/client';

interface iOptions {
  linkToUserPage: string;
  product: Prisma.ProductUncheckedCreateInput;
}

export function forumTopicEntryMsg({ linkToUserPage, product }: iOptions) {
  return (
    'Нове замовлення!\n' +
    'Користувач купив продукт. Переглянути профіль користувача можна за [посиланням](' +
    linkToUserPage +
    '). \n' +
    '\n' +
    'Тип продукту:\n' +
    '*' +
    product.name +
    '*\n' +
    '\n' +
    'Підписка: ' +
    (product.subscriptionDuration > 0 ? 'Так' : 'Ні')
  );
}
