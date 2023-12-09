import { atom, computed } from 'nanostores';
import { createApi } from '../utils/api';
import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import type { iProduct } from '../types';

const api = createApi(API.PRODUCT_LIST);

export const productList$ = createFetcherStore<iProduct[]>(['product-list'], {
  fetcher: api.request<iProduct[]>,
});

export const productId$ = atom<string>('');

export const product$ = computed(
  [productList$, productId$],
  (productListQuery, productId) =>
    productListQuery.data?.find?.((p) => Number(p.id) === Number(productId)),
);
