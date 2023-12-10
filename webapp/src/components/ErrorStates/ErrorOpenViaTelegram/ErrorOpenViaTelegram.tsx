import { TIDS } from '../../../constants/testIds';
import styles from './ErrorOpenViaTelegram.module.css';

// TODO write message in uk
export function ErrorOpenViaTelegram() {
  return (
    <div className={styles.container} data-testid={TIDS.ERR_OPEN_VIA_TG}>
      Please open webapp via telegram bot
    </div>
  );
}
