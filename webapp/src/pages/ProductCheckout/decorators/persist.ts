import { createPersistDecorator } from '../../../utils/final-form';
import { product$ } from '../../../stores/product';
import { tg } from '../../../utils/tg';
import { user$ } from '../../../stores/user';
import type { iFormValues } from '../types';
import { waitingForPaymentOrder$ } from '../../../stores/order';

const PERSIST_KEY = 'order-form';

export function getPersistDecorator() {
  const userQuery = user$.get();
  const waitingForPaymentOrderQuery = waitingForPaymentOrder$.get();
  const user = userQuery.data!;
  const order = waitingForPaymentOrderQuery.data;

  const populateValues: Partial<iFormValues> = {
    userId: tg.initDataUnsafe.user?.id,
    name: user?.name,
    surname: user?.surname,
    patronymic: user?.patronymic,
    birthDate: user?.birthDate,
    email: user?.email,
    phone: user?.phone,
    productId: product$.get()?.id,
    orderId: order?.id,
  };

  return createPersistDecorator<iFormValues>({
    lsKey: PERSIST_KEY,
    populateValues,
    exclude: ['orderId', 'productId', 'userId'],
  });
}
