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
import { $t } from '../../stores/i18n';

import styles from './AppointmentList.module.css';

export function AppointmentListPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useStore($t);
  const { data: activeAppointment } = useStore($activeAppointment);
  const { data: activeOrder } = useStore($activeOrder);
  const navigate = useNavigate();

  switch (true) {
    case Boolean(
      activeAppointment &&
        'status' in activeAppointment &&
        activeAppointment?.status === 'DONE' &&
        !activeOrder?.subscriptionEndsAt,
    ): {
      return (
        <div className={styles.oneTimeOrderContainer}>
          <Emoji emoji="sunglasses" />
          <span className={styles.oneTimeOrderInfo}>
            {t.warnOneTimeOrderAppointmentLimit}
          </span>
        </div>
      );
    }

    case Boolean(activeAppointment): {
      // TODO: fix type
      // @ts-ignore
      const { time, id } = activeAppointment!;
      const deleteAppointment = createDeleteAppointment(id, t);

      return (
        <div className={styles.listContainer}>
          <h2 className={styles.title}>{t.meetings}</h2>
          <div className={styles.card}>
            <b>{t.neurologist}</b>

            <span>{t.doctorShmarhaliova}</span>

            <span>
              {format(new Date(time), 'HH:mm eeee, dd.LL.yyyy', { locale: uk })}
            </span>

            <div className={styles.buttonContainer}>
              <Button
                type="button"
                onClick={() => navigate(ROUTES.APPOINTMENT_CREATE)}
              >
                {t.change}
              </Button>

              <Button
                type="button"
                className={styles.buttonDelete}
                disabled={isDeleting}
                onClick={() =>
                  tg.showConfirm(t.cancelAppointmentAlert, async (confirm) => {
                    if (!confirm) return;

                    setIsDeleting(true);

                    await deleteAppointment();

                    setIsDeleting(false);
                  })
                }
              >
                {t.cancel}
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
          {t.appointmentListEmpty}
          <TgMainButton
            text={t.makeAppointment}
            handleClick={() => navigate(ROUTES.APPOINTMENT_CREATE)}
          />
        </div>
      );
    }
  }
}
