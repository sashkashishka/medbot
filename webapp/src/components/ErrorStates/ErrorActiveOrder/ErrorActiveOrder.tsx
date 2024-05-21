import { useStore } from '@nanostores/react';
import { TIDS } from '../../../constants/testIds';
import { getUserId } from '../../../utils/tg';
import { CopyEmail } from '../../CopyEmail';
import { Emoji } from '../../Emoji';
import { $t } from '../../../stores/i18n';

import styles from './ErrorActiveOrder.module.css';

export function ErrorActiveOrder() {
  const t = useStore($t);
  return (
    <div data-testid={TIDS.ERR_ACTIVE_ORDER} className={styles.container}>
      <Emoji emoji="thinks" />
      <br />
      <br />
      {t.errorYouHaveAlreadyExistingOrder}
      <CopyEmail />
      <br />
      <br />
      <code>user: {getUserId()}</code>
    </div>
  );
}
