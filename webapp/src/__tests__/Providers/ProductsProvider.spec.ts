import { type Server } from 'miragejs';
import { render, waitFor } from '@testing-library/react';
import { allTasks } from 'nanostores';

import { createWrapper, wipeStores } from '../../utils/testing';
import { setupMirage } from '../../utils/mirage';
import { ROUTES } from '../../constants/routes';
import { TIDS } from '../../constants/testIds';
import { API } from '../../constants/api';

describe('ProductsProvider', () => {
  let server: Server;

  afterEach(() => {
    server.shutdown();
    wipeStores();
  });

  describe('ErrorProductsInit', () => {
    beforeEach(() => {
      server = setupMirage({
        errorRoutes: { get: { [API.USER]: { code: 400, times: 1 } } },
      });
    });

    it.each([ROUTES.PRODUCTS, ROUTES.PRODUCT_ITEM, ROUTES.PRODUCT_CHECKOUT])(
      'should show error state on %s route if init error',
      async (route) => {
        const { queryByTestId } = render(
          createWrapper({ routerOptions: { initialEntries: [route] } }),
        );

        await waitFor(allTasks);

        expect(queryByTestId(TIDS.ERR_PRODUCTS_INIT)).toBeInTheDocument();
      },
    );
  });

  describe('ActiveOrderGuard', () => {
    beforeEach(() => {
      server = setupMirage({
        scenario: 'hasActiveOrder',
      });
    });

    it.each([ROUTES.PRODUCTS, ROUTES.PRODUCT_ITEM, ROUTES.PRODUCT_CHECKOUT])(
      'should show error state on %s route if there is an active order',
      async (route) => {
        const { queryByTestId } = render(
          createWrapper({ routerOptions: { initialEntries: [route] } }),
        );

        await waitFor(allTasks);

        expect(queryByTestId(TIDS.ERR_ACTIVE_ORDER)).toBeInTheDocument();
      },
    );
  });
});
