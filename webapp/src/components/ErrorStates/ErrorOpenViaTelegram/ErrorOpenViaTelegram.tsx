import { useStore } from '@nanostores/react';
import { TIDS } from '../../../constants/testIds';
import { Link } from '../../Link';
import { $t } from '../../../stores/i18n';
import styles from './ErrorOpenViaTelegram.module.css';

export function ErrorOpenViaTelegram() {
  const t = useStore($t);
  return (
    <div className={styles.container} data-testid={TIDS.ERR_OPEN_VIA_TG}>
      <Link to={import.meta.env.VITE_TG_BOT} external>
        {t.openViaTgBot}
      </Link>
    </div>
  );
}
