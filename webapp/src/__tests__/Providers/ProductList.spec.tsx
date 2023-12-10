import { describe, it } from '@jest/globals';
import type { Server } from 'miragejs';
import { allTasks } from 'nanostores';
import { render, waitFor, act } from '@testing-library/react';
import { createWrapper } from '../../utils/testing';
import { setupMirage } from '../../utils/mirage';
import { ROUTES } from '../../constants/routes';
import { TIDS } from '../../constants/testIds';

describe('ProductList', () => {
  let server: Server;

  beforeEach(() => {
    server = setupMirage();
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should render product list', async () => {
    const { getAllByTestId } = render(
      createWrapper({ routerOptions: { initialEntries: [ROUTES.PRODUCTS] } }),
    );

    await waitFor(allTasks);

    expect(getAllByTestId(TIDS.PRODUCT_ITEM_LINK)).toHaveLength(
      server.schema.db.products.length,
    );
  });

  it('should navigate to product detail', async () => {
    const { getAllByTestId, getByTestId } = render(
      createWrapper({ routerOptions: { initialEntries: [ROUTES.PRODUCTS] } }),
    );

    await waitFor(allTasks);

    const [link] = getAllByTestId(TIDS.PRODUCT_ITEM_LINK);

    act(() => link.click());

    await waitFor(allTasks);

    expect(getByTestId(TIDS.PRODUCT_DETAIL_CONTAIENR)).toBeInTheDocument();
  });
});
