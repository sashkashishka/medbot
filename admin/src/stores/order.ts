import { createFetcherStore } from './_query';
import type { iPaginatorResp, iOrder } from '../types';
import { createListFilters, type iPagination } from './_list-filters';

export const ORDER_PAGE_SIZE = 20;

export interface iOrderListFilters extends iPagination {
  date_sort: 'asc' | 'desc';
  user_id?: string;
  status?: iOrder['status'];
  has_subscription?: 0 | 1;
}

const defaultOrderListFilters: iOrderListFilters = {
  page: 1,
  date_sort: 'desc',
  user_id: undefined,
  status: undefined,
  has_subscription: 0,
};

export const {
  $listFilters: $orderListFilters,
  $listFilterQuery: $orderListFilterQuery,
  setListFilter: setOrderListFilter,
  resetListFilter: resetOrderListFilter,
} = createListFilters(defaultOrderListFilters, { take: ORDER_PAGE_SIZE });

export const ORDER_KEYS = {
  orderList: ['order/list', $orderListFilterQuery],
};

export const $orders = createFetcherStore<iPaginatorResp<iOrder>>(
  ORDER_KEYS.orderList,
);
