import { generatePath } from 'react-router-dom';
import { tg } from '../utils/tg';
import { API } from '../constants/api';
import type { iUser } from '../types';
import { createFetcherStore } from './fetcher';

const userId = String(tg.initDataUnsafe.user?.id);

export const user$ = createFetcherStore<iUser>({
  url: generatePath(API.USER, { userId }),
});
