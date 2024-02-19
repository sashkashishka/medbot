import { createPersistDecorator } from '../../../../../utils/final-form';
import { getUserId } from '../../../../../utils/tg';
import { $user } from '../../../../../stores/user';
import type { iFormValues } from '../types';

const PERSIST_KEY = 'activate-code-form';

export function getPersistDecorator() {
  const userQuery = $user.get();
  const user = userQuery.data!;

  const populateValues: Partial<iFormValues> = {
    userId: getUserId(),
    name: user?.name,
    surname: user?.surname,
    patronymic: user?.patronymic,
    birthDate: user?.birthDate,
    email: user?.email,
    phone: user?.phone,
  };

  return createPersistDecorator<iFormValues>({
    lsKey: PERSIST_KEY,
    populateValues,
    exclude: ['userId'],
  });
}
