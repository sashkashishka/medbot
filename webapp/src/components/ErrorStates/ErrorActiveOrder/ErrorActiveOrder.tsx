import { TIDS } from '../../../constants/testIds';
import { CopyToClipboard } from '../../CopyToClipboard';
import { Emoji } from '../../Emoji';
import { Link } from '../../Link';

import styles from './ErrorActiveOrder.module.css';

interface iProps {
  userId: number;
}

const EMAIL = 'medihelp.ua@gmail.com';

export function ErrorActiveOrder({ userId }: iProps) {
  return (
    <div data-testid={TIDS.ERR_ACTIVE_ORDER} className={styles.container}>
      <Emoji width={60} height={60} emoji="thinks" />
      <br />
      <br />У вас вже є активне замовлення. Якщо ви не можете нічого зробити -
      відправте скріншот цього екрану на цю пошту{' '}
      <CopyToClipboard text={EMAIL}>
        <Link to="#" external>
          {EMAIL}
        </Link>
      </CopyToClipboard>{' '}
      і ми швидко вам допоможемо.
      <br />
      <br />
      <code>user: {userId}</code>
    </div>
  );
}
