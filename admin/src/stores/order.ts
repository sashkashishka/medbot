import { createFetcherStore } from './_query';
import type { iPaginatorResp, iOrder } from '../types';
import { createListFilters, type iPagination } from './_list-filters';

export const ORDER_PAGE_SIZE = 20;

interface iOrderListFilters extends iPagination {
  date_sort: 'asc' | 'desc';
  status?: iOrder['status'];
  has_subscription?: 0 | 1;
}

const defaultOrderListFilters: iOrderListFilters = {
  skip: 0,
  take: ORDER_PAGE_SIZE,
  date_sort: 'desc',
  status: undefined,
  has_subscription: 0,
};

export const {
  $listFilters: $orderListFilters,
  $listFilterQuery: $orderListFilterQuery,
  setListFilter: setOrderListFilter,
  resetListFilter: resetOrderListFilter,
  setPage: setOrderListPage,
} = createListFilters(defaultOrderListFilters);

export const ORDER_KEYS = {
  orderList: ['order/list', $orderListFilterQuery],
};

export const $orders = createFetcherStore<iPaginatorResp<iOrder>>(
  ORDER_KEYS.orderList,
);
