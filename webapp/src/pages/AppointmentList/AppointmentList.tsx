import { useStore } from '@nanostores/react';
import { useNavigate } from 'react-router-dom';

import { activeAppointment$ } from '../../stores/appointment';

import { ROUTES } from '../../constants/routes';

import { Emoji } from '../../components/Emoji';
import { TgMainButton } from '../../components/TgMainButton';

import styles from './AppointmentList.module.css';

export function AppointmentListPage() {
  const { data } = useStore(activeAppointment$);
  const navigate = useNavigate();

  switch (Boolean(data)) {
    case true: {
      return null;
    }

    default: {
      return (
        <div className={styles.emptyContainer}>
          <Emoji emoji="monocle" />
          Список записів пустий
          <TgMainButton
            text="Записатись на прийом"
            handleClick={() => navigate(ROUTES.APPOINTMENT_CREATE)}
          />
        </div>
      );
    }
  }
}
