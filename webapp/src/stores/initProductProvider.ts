import { computed } from 'nanostores';
import { user$ } from './user';
import { activeOrder$, waitingForPaymentOrder$ } from './order';
import { productList$ } from './product';

export const initProductProviderStore$ = computed(
  [user$, activeOrder$, waitingForPaymentOrder$, productList$],
  (
    userQuery,
    activeOrderQuery,
    waitingForPaymentOrderQuery,
    productListQuery,
  ) => {
    return {
      loading:
        userQuery.loading ||
        activeOrderQuery.loading ||
        waitingForPaymentOrderQuery.loading ||
        productListQuery.loading,
      error:
        userQuery.error ||
        activeOrderQuery.error ||
        waitingForPaymentOrderQuery.error ||
        productListQuery.error,
      fetched:
        userQuery.data !== undefined &&
        activeOrderQuery.data !== undefined &&
        waitingForPaymentOrderQuery.data !== undefined &&
        productListQuery.data !== undefined,
    };
  },
);
