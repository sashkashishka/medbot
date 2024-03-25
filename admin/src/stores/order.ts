import { notification } from 'antd';
import { createFetcherStore, createMutatorStore } from './_query';
import type { iPaginatorResp, iOrder, iUser } from '../types';
import { createListFilters, type iPagination } from './_list-filters';
import { $userId } from './user';
import { $sendMessage } from './bot';
import { getOrderCompleteMessage } from '../utils/tg-messages';

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
  list: 'order/list',
  filteredList() {
    return [this.list, $orderListFilterQuery];
  },
  item: ['order/active/', $userId],
};

export const $orders = createFetcherStore<iPaginatorResp<iOrder>>(
  ORDER_KEYS.filteredList(),
);

export const $activeOrder = createFetcherStore<iOrder>(ORDER_KEYS.item);

export const $editOrder = createMutatorStore<iOrder>(({ data, invalidate }) => {
  invalidate((k) => Boolean(k.match(ORDER_KEYS.list)));

  return fetch(`/api/admin/order/update/${data.id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' },
  });
});

export const $completeOrder = createMutatorStore<iOrder>(
  ({ data, invalidate }) => {
    invalidate((k) => Boolean(k.match(ORDER_KEYS.list)));

    return fetch(`/api/admin/order/complete/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' },
    });
  },
);

// ====================
// ====================
// ACTIONS
// ====================
// ====================

export async function completeOrder({
  user,
  activeOrder,
}: {
  user: iUser;
  activeOrder: iOrder;
}): Promise<boolean> {
  try {
    const resp = (await $completeOrder.mutate(activeOrder)) as Response;

    if (resp.ok) {
      await $sendMessage.mutate({
        botChatId: user?.botChatId,
        text: getOrderCompleteMessage(),
      });
      notification.success({ message: 'Order completed!' });
      return true;
    }

    const respData = await resp.json();

    if ('error' in respData && typeof respData.error === 'string') {
      notification.error({ message: respData.error });
      return false;
    }

    throw respData;
  } catch (e) {
    console.error(e);
    notification.error({
      message: 'Unexpected error completing an order',
    });
    return false;
  }
}
