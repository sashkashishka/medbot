import { createFetcherStore } from './_query';
import type { iPaginatorResp, iUser } from '../types';
import { createPaginator } from './_paginator';

export const USER_PAGE_SIZE = 20;

export const { $pageParams, setPage: setUserListPage } =
  createPaginator(USER_PAGE_SIZE);

export const USER_KEYS = {
  userList: ['user', 'list', $pageParams],
};

export const $users = createFetcherStore<iPaginatorResp<iUser>>(
  USER_KEYS.userList,
);
