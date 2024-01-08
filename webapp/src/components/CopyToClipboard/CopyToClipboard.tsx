import React from 'react';
import { tg } from '../../utils/tg';

interface iProps {
  text: string;
  children: React.ReactNode;
}

export function CopyToClipboard({ text, children }: iProps) {
  return (
    <div
      onClick={() => {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            tg.HapticFeedback.notificationOccurred('success');
            tg.showPopup({
              message: 'Скопійовано!',
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
