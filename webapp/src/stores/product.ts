import { action, atom, computed, onAction, onMount } from 'nanostores';
import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import type { iProduct } from '../types';

export const { store: $productList } = createFetcherStore<iProduct[]>({
  url: API.PRODUCT_LIST,
});

export const $productId = atom<string>('');

export const $product = computed(
  [$productList, $productId],
  (productListQuery, productId) =>
    productListQuery.data?.find?.((p) => Number(p.id) === Number(productId)),
);

export const $lastProductId = atom<number>(0);
const LAST_PRODUCT_ID_KEY = 'last-product';

onMount($lastProductId, () => {
  try {
    const productId = Number(window.localStorage.getItem(LAST_PRODUCT_ID_KEY));

    if (!Number.isNaN(productId)) {
      $lastProductId.set(productId);
    }
  } catch (e) {
    console.error(e);
  }

  return () => {};
});

onAction($lastProductId, ({ actionName, args }) => {
  if (actionName !== 'setLastProductId') return;

  try {
    window.localStorage.setItem(LAST_PRODUCT_ID_KEY, String(args[0]));
  } catch (e) {
    console.error(e);
  }
});

export const setLastProductId = action(
  $lastProductId,
  'setLastProductId',
  (store, productId) => store.set(productId),
);

export const $lastProduct = computed(
  [$productList, $lastProductId],
  (productListQuery, lastProductId) =>
    productListQuery.data?.find?.((p) => p.id === lastProductId),
);
