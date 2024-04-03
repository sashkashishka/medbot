import { createMutatorStore } from './_query';

interface iUserdata {
  userId: number;
  botChatId: number;
}

interface iTgCompleteOrder {
  type: 'one-time' | 'subscription';
  body: iUserdata;
}

export const $tgCompleteOrder = createMutatorStore<iTgCompleteOrder>(
  ({ data }) => {
    return fetch(`/api/admin/bot/order/complete/${data.type}`, {
      method: 'PATCH',
      body: JSON.stringify(data.body),
      headers: { 'content-type': 'application/json' },
    });
  },
);

export const $tgCompleteAppointment = createMutatorStore<iUserdata>(
  ({ data }) => {
    return fetch('/api/admin/bot/appointment/complete', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' },
    });
  },
);

export const $tgDeleteAppointment = createMutatorStore<iUserdata>(
  ({ data }) => {
    return fetch('/api/admin/bot/appointment/delete', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' },
    });
  },
);
