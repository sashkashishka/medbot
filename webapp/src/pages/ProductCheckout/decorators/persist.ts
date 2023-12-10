import { createPersistDecorator } from '../../../utils/final-form';
import { product$ } from '../../../stores/product';
import { getUserId } from '../../../utils/tg';
import { user$ } from '../../../stores/user';
import type { iFormValues } from '../types';
import type { iOrder } from '../../../types';

const PERSIST_KEY = 'order-form';

export function getPersistDecorator(waitingForPaymentOrder?: iOrder) {
  const userQuery = user$.get();
  const user = userQuery.data!;

  const populateValues: Partial<iFormValues> = {
    userId: getUserId(),
    name: user?.name,
    surname: user?.surname,
    patronymic: user?.patronymic,
    birthDate: user?.birthDate,
    email: user?.email,
    phone: user?.phone,
    productId: product$.get()?.id,
    orderId: waitingForPaymentOrder?.id,
  };

  return createPersistDecorator<iFormValues>({
    lsKey: PERSIST_KEY,
    populateValues,
    exclude: ['orderId', 'productId', 'userId'],
  });
}
