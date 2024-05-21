import React from 'react';
import { useStore } from '@nanostores/react';

import { tg } from '../../utils/tg';
import { $t } from '../../stores/i18n';

interface iProps {
  text: string;
  children: React.ReactNode;
}

export function CopyToClipboard({ text, children }: iProps) {
  const t = useStore($t);
  return (
    <div
      onClick={() => {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            tg.HapticFeedback.notificationOccurred('success');
            tg.showPopup({
              message: t.copied,
              buttons: [{ type: 'ok' }],
            });
          })
          .catch(console.error);
      }}
    >
      {children}
    </div>
  );
}
