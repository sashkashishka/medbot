import type { iOrder, iAppointment, iProduct, iUser } from '../../types';

export interface iFormValues {
  name: iUser['name'];
  surname: iUser['surname'];
  patronymic: iUser['patronymic'];
  userId: iUser['id'];
  birthDate: iUser['birthDate'];
  phone: iUser['phone'];
  email: iUser['email'];

  productId: iProduct['id'];

  orderId?: iOrder['id'];

  complaints: iAppointment['complaints'];
  complaintsStarted: iAppointment['complaintsStarted'];
  medicine: iAppointment['medicine'];
  chronicDiseases: iAppointment['chronicDiseases'];
}
