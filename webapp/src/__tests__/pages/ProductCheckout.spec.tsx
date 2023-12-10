import type { Server } from 'miragejs';
import { allTasks } from 'nanostores';
import { render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWrapper } from '../../utils/testing';
import { ROUTES } from '../../constants/routes';
import { setupMirage } from '../../utils/mirage';
import { generatePath } from 'react-router-dom';
import { TIDS } from '../../constants/testIds';

describe('ProductCheckout', () => {
  let server: Server;
  const productId = '1';

  describe('newcomer', () => {
    beforeEach(() => {
      server = setupMirage();
    });

    afterEach(() => {
      server.shutdown();
    });

    it('fill fresh form and click submit', async () => {
      const { queryByTestId } = render(
        createWrapper({
          routerOptions: {
            initialEntries: [
              generatePath(ROUTES.PRODUCT_CHECKOUT, { productId }),
            ],
          },
        }),
      );

      await waitFor(allTasks);

      const fields = {
        name: queryByTestId(TIDS.INPUT_NAME)!,
        surname: queryByTestId(TIDS.INPUT_SURNAME)!,
        patronymic: queryByTestId(TIDS.INPUT_PATRONYMIC)!,
        birthdate: queryByTestId(TIDS.INPUT_BIRTHDATE)!,
        phone: queryByTestId(TIDS.INPUT_PHONE)!,
        email: queryByTestId(TIDS.INPUT_EMAIL)!,
      };

      Object.values(fields).forEach((field) => {
        expect(field).toHaveValue('');
      });

      const values = {
        name: 'Sheldon',
        surname: 'Cooper',
        patronymic: 'Lee',
        birthdate: '19.03.1990',
        phone: '1290324234',
        email: 'shcooper@gmail.com',
      };

      await act(() => userEvent.type(fields.name, values.name, { delay: 1 }));
      await act(() =>
        userEvent.type(fields.surname, values.surname, { delay: 1 }),
      );
      await act(() =>
        userEvent.type(fields.patronymic, values.patronymic, { delay: 1 }),
      );
      await act(() =>
        userEvent.type(fields.birthdate, values.birthdate, { delay: 1 }),
      );
      await act(() => userEvent.type(fields.phone, values.phone, { delay: 1 }));
      await act(() => userEvent.type(fields.email, values.email, { delay: 1 }));

      expect(fields.name).toHaveValue(values.name);
      expect(fields.surname).toHaveValue(values.surname);
      expect(fields.patronymic).toHaveValue(values.patronymic);
      expect(fields.birthdate).toHaveValue(values.birthdate);
      expect(fields.phone).toHaveValue(values.phone);
      expect(fields.email).toHaveValue(values.email);
    });

    it.todo('case when user opens payment form and closes it (status cancelled)')
    it.todo('case when user opens payment form and payment failed')
    it.todo('case when user opens payment form and payment pending')
    it.todo('case when user opens payment form and payment success')
  });
});
