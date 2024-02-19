import type { iUser } from '../../../../types';

export interface iFormValues {
  name: iUser['name'];
  surname: iUser['surname'];
  patronymic: iUser['patronymic'];
  userId: iUser['id'];
  birthDate: iUser['birthDate'];
  phone: iUser['phone'];
  email: iUser['email'];

  code: number;
}
