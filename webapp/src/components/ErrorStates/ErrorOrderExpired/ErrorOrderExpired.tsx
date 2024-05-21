import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { tg } from '../../../utils/tg';
import { $t } from '../../../stores/i18n';

export function ErrorOrderExpired() {
  const t = useStore($t);

  useEffect(() => {
    try {
      tg.showPopup(
        {
          message: t.yourSubscriptionHasEndedAlert,
          buttons: [{ type: 'close' }],
        },
        () => {
          tg.disableClosingConfirmation();
          tg.close();
        },
      );
    } catch (e) {}
  }, [t]);

  return null;
}
