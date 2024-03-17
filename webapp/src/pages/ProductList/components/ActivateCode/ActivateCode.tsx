import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';

import styles from './ActivateCode.module.css';

export function ActivateCode() {
  const navigate = useNavigate();

  return (
    <div
      className={styles.container}
      onClick={() => navigate(ROUTES.PRODUCT_ACTIVATE_CODE)}
    >
      У мене є код активації
    </div>
  );
}
