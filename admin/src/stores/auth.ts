import type { iLogin, iRegister } from '../types';
import { createMutatorStore } from './_query';
import { ADMIN_KEYS } from './admin';

export const $register = createMutatorStore<iRegister>(
  ({ data, invalidate }) => {
    invalidate(ADMIN_KEYS.admin);

    return fetch('/api/auth/admin/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' },
    });
  },
);

export const $login = createMutatorStore<iLogin>(({ data, invalidate }) => {
  invalidate(ADMIN_KEYS.admin);

  return fetch('/api/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' },
  });
});

export const $logout = createMutatorStore(({ invalidate }) => {
  invalidate(ADMIN_KEYS.admin);

  return fetch('/api/auth/admin/logout', {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
  });
});
