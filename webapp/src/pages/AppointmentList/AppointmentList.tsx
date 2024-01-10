import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { generatePath, useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import uk from 'date-fns/locale/uk';

import {
  activeAppointment$,
  refetchActiveAppointment,
  refetchFreeSlots,
} from '../../stores/appointment';

import { ROUTES } from '../../constants/routes';

import { Emoji } from '../../components/Emoji';
import { TgMainButton } from '../../components/TgMainButton';
import { Button } from '../../components/Button';

import { tg } from '../../utils/tg';

import styles from './AppointmentList.module.css';
import { createApi } from '../../utils/api';
import { API } from '../../constants/api';

export function AppointmentListPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { data } = useStore(activeAppointment$);
  const navigate = useNavigate();

  switch (Boolean(data)) {
    case true: {
      const { time } = data!;

      return (
        <div className={styles.listContainer}>
          <h2 className={styles.title}>Зустрічі</h2>
          <div className={styles.card}>
            <b>Невролог</b>

            <span>Шмаргальова Катерина Юріївна</span>

            <span>
              {format(new Date(time), 'HH:mm eeee, dd.LL.yyyy', { locale: uk })}
            </span>

            <div className={styles.buttonContainer}>
              <Button
                type="button"
                onClick={() => navigate(ROUTES.APPOINTMENT_CREATE)}
              >
                Змінити
              </Button>

              <Button
                type="button"
                className={styles.buttonDelete}
                disabled={isDeleting}
                onClick={() =>
                  tg.showConfirm('Відмінити зустріч?', async () => {
                    const api = createApi(
                      generatePath(API.UPDATE_DELETE_APPOINTMENT, {
                        appointmentId: String(data?.id),
                      }) as API.UPDATE_DELETE_APPOINTMENT,
                      {
                        method: 'DELETE',
                        body: '{}',
                      },
                    );
                    setIsDeleting(true);

                    try {
                      await api.request();
                      refetchActiveAppointment();
                      refetchFreeSlots();
                    } catch (e) {
                      tg.showAlert(
                        'Сталась помилка при видаленні. Спробуйте пізніше',
                      );
                      console.error(e);
                    } finally {
                      setIsDeleting(false);
                    }
                  })
                }
              >
                Відмінити
              </Button>
            </div>
          </div>
        </div>
      );
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
