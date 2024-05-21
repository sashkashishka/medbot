import { useStore } from '@nanostores/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { $t } from '../../../../stores/i18n';

import styles from './ActivateCode.module.css';

export function ActivateCode() {
  const navigate = useNavigate();
  const t = useStore($t);

  return (
    <div
      className={styles.container}
      onClick={() => navigate(ROUTES.PRODUCT_ACTIVATE_CODE)}
    >
      {t.iHaveActivationCode}
    </div>
  );
}
