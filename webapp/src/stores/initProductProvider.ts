import { computed } from 'nanostores';
import { user$ } from './user';
import { activeOrder$ } from './order';
import { productList$ } from './product';

export const initProductProviderStore$ = computed(
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
        userQuery.fetched &&
        activeOrderQuery.fetched &&
        productListQuery.fetched,
    };
  },
);
