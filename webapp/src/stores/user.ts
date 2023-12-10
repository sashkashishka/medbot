import { generatePath } from 'react-router-dom';

import { createApi } from '../utils/api';
import { tg } from '../utils/tg';
import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import type { iUser } from '../types';

const api = createApi(
  generatePath(API.USER, { userId: String(tg.initDataUnsafe.user?.id) }),
);

export const user$ = createFetcherStore<iUser>(['user'], {
  fetcher: api.request<iUser>,
});
