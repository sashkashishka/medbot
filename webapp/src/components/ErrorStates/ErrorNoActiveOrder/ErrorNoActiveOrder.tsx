import { TIDS } from '../../../constants/testIds';
import { getUserId } from '../../../utils/tg';
import { CopyEmail } from '../../CopyEmail';
import { Emoji } from '../../Emoji';

import styles from './ErrorNoActiveOrder.module.css';

export function ErrorNoActiveOrder() {
  return (
    <div data-testid={TIDS.ERR_NO_ACTIVE_ORDER} className={styles.container}>
      <Emoji emoji="astonished" />
      <br />
      <br />У вас немає активного замовлення, тому ви не можете записатись до
      лікаря. Відправте скріншот цього екрану на цю пошту <CopyEmail />
      і ми швидко вам допоможемо.
      <br />
      <br />
      <code>user: {getUserId()}</code>
    </div>
  );
}
