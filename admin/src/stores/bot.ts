import { type iSendMessageBody } from '../types';
import { createMutatorStore } from './_query';

export const $sendMessage = createMutatorStore<iSendMessageBody>(({ data }) => {
  return fetch('/api/admin/send-message', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' },
  });
});
