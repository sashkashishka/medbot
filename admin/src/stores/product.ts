import { createFetcherStore } from './_query';
import type { iProduct } from '../types';

export const PRODUCT_KEYS = {
  productList: ['product', 'list'],
};

export const $products = createFetcherStore<iProduct[]>(
  PRODUCT_KEYS.productList,
);
