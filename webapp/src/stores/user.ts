import { atom, onMount, task } from 'nanostores';
import { createApi } from '../utils/api';
import { tg } from '../utils/tg';
import { API } from '../constants/api';
import type { iUser } from '../types';

export const user$ = atom<iUser>({});

// onMount(user$, () => {
//   const userId = tg.initDataUnsafe.user?.id;
//   const searchParams = new URLSearchParams({ id: String(userId) });

//   const api = createApi(`${API.USER}?${searchParams}`);

//   task(async () => {
//     const [resp] = await api.request<iUser>();

//     if (resp) {
//       user$.set(resp);
//     }
//   });

//   return () => {
//     api.controller.abort();
//   };
// });
