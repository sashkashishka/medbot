import { generatePath } from 'react-router-dom';
import { API } from '../../constants/api';
import { iAppointment } from '../../types';
import { createApi } from '../../utils/api';
import { tg } from '../../utils/tg';

export function createDeleteAppointment(id: iAppointment['id']) {
  return async function deleteAppointment() {
    const deleteApi = createApi(
      generatePath(API.UPDATE_DELETE_APPOINTMENT, {
        appointmentId: String(id),
      }) as API.UPDATE_DELETE_APPOINTMENT,
      {
        method: 'DELETE',
        body: '{}',
      },
    );
    const sendStatusApi = createApi(API.MEDBOT_SEND_APPOINTMENT_STATUS, {
      method: 'POST',
      body: JSON.stringify({ status: 'deleted' }),
    });

    try {
      tg.disableClosingConfirmation();

      await deleteApi.request();
      await sendStatusApi.request();
    } catch (e) {
      tg.enableClosingConfirmation();
      tg.showAlert('Сталась помилка при видаленні. Спробуйте пізніше');
      console.error(e);
    }
  };
}
