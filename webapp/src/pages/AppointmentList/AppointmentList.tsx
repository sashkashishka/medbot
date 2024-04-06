import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import uk from 'date-fns/locale/uk';

import { $activeAppointment } from '../../stores/appointment';
import { $activeOrder } from '../../stores/order';

import { ROUTES } from '../../constants/routes';

import { Emoji } from '../../components/Emoji';
import { TgMainButton } from '../../components/TgMainButton';
import { Button } from '../../components/Button';

import { tg } from '../../utils/tg';
import { createDeleteAppointment } from './utils';

import styles from './AppointmentList.module.css';

export function AppointmentListPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: activeAppointment } = useStore($activeAppointment);
  const { data: activeOrder } = useStore($activeOrder);
  const navigate = useNavigate();

  switch (true) {
    case Boolean(
      'status' in activeAppointment! &&
        activeAppointment?.status === 'DONE' &&
        !activeOrder?.subscriptionEndsAt,
    ): {
      return (
        <div className={styles.oneTimeOrderContainer}>
          <Emoji emoji="sunglasses" />
          <span className={styles.oneTimeOrderInfo}>
            Дякуємо за візит! Нажаль, в рамках даної консультації ви вже не
            можете записатись ще раз. Дочекайтесь як лікар випише Вам
            рекомендації і замовте консультацію ще раз.
          </span>
        </div>
      );
    }

    case Boolean(activeAppointment): {
      // TODO: fix type
      // @ts-ignore
      const { time, id } = activeAppointment!;
      const deleteAppointment = createDeleteAppointment(id);

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
                  tg.showConfirm('Відмінити зустріч?', async (confirm) => {
                    if (!confirm) return;

                    setIsDeleting(true);

                    await deleteAppointment();

                    setIsDeleting(false);
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
