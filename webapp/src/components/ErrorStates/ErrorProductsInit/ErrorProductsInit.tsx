import { TIDS } from '../../../constants/testIds';
import { getUserId } from '../../../utils/tg';
import { Button } from '../../Button';
import { CopyEmail } from '../../CopyEmail';
import { Emoji } from '../../Emoji';

import styles from './ErrorProductsInit.module.css';

export function ErrorProductsInit() {
  return (
    <div data-testid={TIDS.ERR_PRODUCTS_INIT} className={styles.container}>
      <Emoji emoji="confused" />
      <br />
      <br />
      Сталась помилка
      <br />
      <br />
      <Button type="button" onClick={() => window.location.reload()}>
        Перезавантажити сторінку
      </Button>
      <br />
      <br />
      Якщо помилка не зникає - відправте скріншот цього екрану на цю пошту{' '}
      <CopyEmail />
      і ми швидко вам допоможемо.
      <br />
      <br />
      <code>user: {getUserId()}</code>
    </div>
  );
}
