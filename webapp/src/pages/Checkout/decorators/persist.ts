import { createPersistDecorator } from '../../../utils/final-form';
import { product$ } from '../../../stores/product';
import { tg } from '../../../utils/tg';
import type { iFormValues } from '../types';

const PERSIST_KEY = 'order-form';

export function getPersistDecorator() {
  // TODO init with WAITING_FOR_PAYMENT order id
  const populateValues: Partial<iFormValues> = {
    userId: tg.initDataUnsafe.user?.id,
    productId: product$.get()?.id,
  };

  return createPersistDecorator<iFormValues>({ lsKey: PERSIST_KEY, populateValues });
}
