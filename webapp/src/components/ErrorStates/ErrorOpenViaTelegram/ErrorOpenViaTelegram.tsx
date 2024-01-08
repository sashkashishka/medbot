import { TIDS } from '../../../constants/testIds';
import { Link } from '../../Link';
import styles from './ErrorOpenViaTelegram.module.css';

export function ErrorOpenViaTelegram() {
  return (
    <div className={styles.container} data-testid={TIDS.ERR_OPEN_VIA_TG}>
      Відкрийте через{' '}
      <Link to={import.meta.env.VITE_TG_BOT} external>
        телеграм бот
      </Link>
    </div>
  );
}
