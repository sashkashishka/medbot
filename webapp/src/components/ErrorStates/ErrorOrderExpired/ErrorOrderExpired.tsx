import { useEffect } from 'react';
import { tg } from '../../../utils/tg';

export function ErrorOrderExpired() {
  useEffect(() => {
    tg.showPopup(
      {
        message: 'Ваша підписка закінчилась',
        buttons: [{ type: 'close' }],
      },
      () => {
        tg.close();
      },
    );
  }, []);

  return null;
}
