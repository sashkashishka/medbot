import { createFetcherStore } from './_query';
import type { iPaginatorResp, iUser } from '../types';
import { createListFilters, type iPagination } from './_list-filters';

export const USER_PAGE_SIZE = 20;

interface iUserListFilters extends iPagination {
  date_sort: 'asc' | 'desc';
}

const defaultUserListFilters: iUserListFilters = {
  skip: 0,
  take: USER_PAGE_SIZE,
  date_sort: 'desc',
};

export const {
  $listFilters: $userListFilters,
  $listFilterQuery: $userListFilterQuery,
  setListFilter: setUserListFilter,
  resetListFilter: resetUserListFilter,
  setPage: setUserListPage,
} = createListFilters(defaultUserListFilters);

export const USER_KEYS = {
  userList: ['user/list', $userListFilterQuery],
};

export const $users = createFetcherStore<iPaginatorResp<iUser>>(
  USER_KEYS.userList,
);
