import { useStore } from '@nanostores/react';
import { TIDS } from '../../../constants/testIds';
import { getUserId } from '../../../utils/tg';
import { CopyEmail } from '../../CopyEmail';
import { Emoji } from '../../Emoji';
import { $t } from '../../../stores/i18n';

import styles from './ErrorNoActiveOrder.module.css';

export function ErrorNoActiveOrder() {
  const t = useStore($t);

  return (
    <div data-testid={TIDS.ERR_NO_ACTIVE_ORDER} className={styles.container}>
      <Emoji emoji="astonished" />
      <br />
      <br />
      {t.errorYouDontHaveActiveOrder}
      <CopyEmail />
      <br />
      <br />
      <code>user: {getUserId()}</code>
    </div>
  );
}
