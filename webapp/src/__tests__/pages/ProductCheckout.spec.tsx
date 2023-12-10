import { describe, it } from '@jest/globals';
import type { Server } from 'miragejs';
// import { allTasks } from 'nanostores';
// import { render, waitFor } from '@testing-library/react';
// import { createWrapper } from '../../../utils/testing';
// import { ROUTES } from '../../../constants/routes';
import { setupMirage } from '../../utils/mirage';

describe('ProductCheckout', () => {
  let server: Server;

  beforeEach(() => {
    server = setupMirage();
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should render ProductCheckout', async () => {
    // const { getAllByTestId } = render(
    //   createWrapper({ routerOptions: { initialEntries: [ROUTES.PRODUCTS] } }),
    // );

    // await waitFor(allTasks)
  });
});
