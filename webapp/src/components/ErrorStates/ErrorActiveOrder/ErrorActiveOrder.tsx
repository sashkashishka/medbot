import { TIDS } from '../../../constants/testIds';
import { getUserId } from '../../../utils/tg';
import { CopyEmail } from '../../CopyEmail';
import { Emoji } from '../../Emoji';

import styles from './ErrorActiveOrder.module.css';

export function ErrorActiveOrder() {
  return (
    <div data-testid={TIDS.ERR_ACTIVE_ORDER} className={styles.container}>
      <Emoji emoji="thinks" />
      <br />
      <br />У вас вже є активне замовлення, тому ви не можете створити нове.
      Якщо у вас немає кнопки "Записатись" -
      відправте скріншот цього екрану на цю пошту <CopyEmail />
      і ми швидко вам допоможемо.
      <br />
      <br />
      <code>user: {getUserId()}</code>
    </div>
  );
}
