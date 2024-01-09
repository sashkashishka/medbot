import type { iAppointment, iOrder, iUser } from '../../../../types';

export interface iFormValues {
  complaints: iAppointment['complaints'];
  complaintsStarted: iAppointment['complaintsStarted'];
  medicine: iAppointment['medicine'];
  chronicDiseases: iAppointment['chronicDiseases'];
  time: iAppointment['time'];
  orderId: iOrder['id'];
  userId: iUser['id'];
  status: iAppointment['status'];
}
