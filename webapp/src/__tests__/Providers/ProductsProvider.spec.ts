import { describe, it } from '@jest/globals';
import { type Server } from 'miragejs';
import { render, waitFor } from '@testing-library/react';
import { allTasks } from 'nanostores';

import { createWrapper } from '../../utils/testing';
import { setupMirage } from '../../utils/mirage';
import { ROUTES } from '../../constants/routes';
import { TIDS } from '../../constants/testIds';
import { API } from '../../constants/api';

describe('ProductsProvider', () => {
  let server: Server;

  describe('ErrorProductsInit', () => {
    afterEach(() => {
      server.shutdown();
    });
    it.each([ROUTES.PRODUCTS, ROUTES.PRODUCT_ITEM, ROUTES.PRODUCT_CHECKOUT])(
      'should show error state on %s route if init error',
      async (route) => {
        server = setupMirage({
          errorRoutes: { get: { [API.USER]: { code: 400, times: 1 } } },
        });

        const { queryByTestId } = render(
          createWrapper({ routerOptions: { initialEntries: [route] } }),
        );

        await waitFor(allTasks);

        expect(queryByTestId(TIDS.ERR_PRODUCTS_INIT)).toBeInTheDocument();
      },
    );
  });

  describe('ActiveOrderGuard', () => {
    afterEach(() => {
      server.shutdown();
    });
    it.each([ROUTES.PRODUCTS, ROUTES.PRODUCT_ITEM, ROUTES.PRODUCT_CHECKOUT])(
      'should show error state on %s route if there is an active order',
      async (route) => {
        server = setupMirage({
          scenario: 'hasActiveOrder',
        });

        const { queryByTestId } = render(
          createWrapper({ routerOptions: { initialEntries: [route] } }),
        );

        await waitFor(allTasks);

        expect(queryByTestId(TIDS.ERR_ACTIVE_ORDER)).toBeInTheDocument();
      },
    );
  });
});
