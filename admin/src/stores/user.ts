import { type DescriptionsProps } from 'antd';
import { generatePath } from 'react-router-dom';
import { atom, computed } from 'nanostores';
import { createFetcherStore } from './_query';
import type { iPaginatorResp, iUser } from '../types';
import { createListFilters, type iPagination } from './_list-filters';
import { $adminConfig } from './admin';
import { formatDate } from '../utils/date';

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

export const $userId = atom<string>('');

export function setUserId(id: string) {
  $userId.set(id);
}

export const USER_KEYS = {
  userList: ['user/list', $userListFilterQuery],
  user: ['user/', $userId],
};

export const $users = createFetcherStore<iPaginatorResp<iUser>>(
  USER_KEYS.userList,
);

export const $user = createFetcherStore<iUser>(USER_KEYS.user);

export const $fullName = computed($user, (user) => {
  if (user.error || user.loading) return '';

  return `${user.data?.surname} ${user.data?.name} ${user.data?.patronymic}`;
});

export const $tgLink = computed([$user, $adminConfig], (user, adminConfig) => {
  if (user.error || user.loading || adminConfig.error || adminConfig.loading)
    return '';

  try {
    return generatePath(adminConfig.data?.forumUrlTemplate!, {
      id: user.data?.messageThreadId,
    });
  } catch (e) {
    console.error(e);
    return '';
  }
});

export const $userDescriptionItems = computed(
  $user,
  ({ data, error, loading }) => {
    if (error || loading) return [];

    return Object.keys(data || {}).reduce<DescriptionsProps['items']>((acc, val, i) => {
      const key = val as keyof iUser;

      if (key === 'id') return acc;

      let children = data?.[key];

      if (key === 'birthDate') {
        children = formatDate(data?.[key]!);
      }

      acc!.push({
        key: String(i),
        label: key,
        children,
      });

      return acc;
    }, []);
  },
);
