import { createFetcherStore, createMutatorStore } from './_query';
import type { iProduct } from '../types';

export const PRODUCT_KEYS = {
  list: 'product/list',
  filteredList() {
    return [this.list];
  },
};

export const $products = createFetcherStore<iProduct[]>(
  PRODUCT_KEYS.filteredList(),
);

export const $createProduct = createMutatorStore<iProduct>(
  ({ data, invalidate }) => {
    invalidate(PRODUCT_KEYS.list);

    return fetch('/api/admin/product/create', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' },
    });
  },
);

export const $editProduct = createMutatorStore<iProduct>(
  ({ data, invalidate }) => {
    invalidate(PRODUCT_KEYS.list);

    return fetch(`/api/admin/product/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' },
    });
  },
);

export const $deleteProduct = createMutatorStore<Partial<iProduct>>(
  ({ data, invalidate }) => {
    invalidate(PRODUCT_KEYS.list);

    return fetch(`/api/admin/product/${data.id}`, {
      method: 'DELETE',
      body: '{}',
      headers: { 'content-type': 'application/json' },
    });
  },
);
