import { useEffect } from 'react';
import { tg } from '../../../utils/tg';

export function ErrorOrderExpired() {
  useEffect(() => {
    try {
      tg.showPopup(
        {
          message: 'Ваша підписка закінчилась',
          buttons: [{ type: 'close' }],
        },
        () => {
          tg.disableClosingConfirmation();
          tg.close();
        },
      );
    } catch (e) {}
  }, []);

  return null;
}
