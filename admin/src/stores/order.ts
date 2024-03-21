import { createFetcherStore } from './_query';
import type { iPaginatorResp, iOrder } from '../types';
import { createPaginator } from './_paginator';

export const ORDER_PAGE_SIZE = 20;

export const { $pageParams, setPage: setOrderListPage } =
  createPaginator(ORDER_PAGE_SIZE);

export const ORDER_KEYS = {
  orderList: ['order', 'list', $pageParams],
};

export const $orders = createFetcherStore<iPaginatorResp<iOrder>>(
  ORDER_KEYS.orderList,
);
