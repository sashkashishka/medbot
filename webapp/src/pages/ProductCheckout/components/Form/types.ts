import type { iOrder, iProduct, iUser } from '../../../../types';

export interface iFormValues {
  name: iUser['name'];
  surname: iUser['surname'];
  patronymic: iUser['patronymic'];
  userId: iUser['id'];
  birthDate: iUser['birthDate'];
  phone: iUser['phone'];
  email: iUser['email'];
  timezoneOffset: iUser['timezoneOffset'];
  timeZone: iUser['timeZone'];

  productId: iProduct['id'];

  orderId?: iOrder['id'];
}
