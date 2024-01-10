import { atom, computed } from 'nanostores';
import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import type { iProduct } from '../types';

export const { store: productList$ } = createFetcherStore<iProduct[]>({
  url: API.PRODUCT_LIST
});

export const productId$ = atom<string>('');

export const product$ = computed(
  [productList$, productId$],
  (productListQuery, productId) =>
    productListQuery.data?.find?.((p) => Number(p.id) === Number(productId)),
);
