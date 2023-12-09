import { computed } from 'nanostores';
import { user$ } from './user';
import { activeOrder$ } from './order';
import { productList$ } from './product';

export const initStore$ = computed(
  [user$, activeOrder$, productList$],
  (userQuery, activeOrderQuery, productListQuery) => {
    return {
      loading:
        userQuery.loading ||
        activeOrderQuery.loading ||
        productListQuery.loading,
      error:
        userQuery.error || activeOrderQuery.error || productListQuery.error,
      fetched:
        userQuery.data !== undefined &&
        activeOrderQuery.data !== undefined &&
        productListQuery.data !== undefined,
    };
  },
);
