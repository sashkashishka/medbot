import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { cleanStores as nanostoresCleanStores } from 'nanostores';

import { routes as defaultRoutes } from '../pages/routes';
import { user$ } from '../stores/user';
import { product$, productId$, productList$ } from '../stores/product';
import { activeOrder$, waitingForPaymentOrder$ } from '../stores/order';
import { initProductProviderStore$ } from '../stores/initProductProvider';

interface iOptions {
  routes?: Parameters<typeof createMemoryRouter>[0];
  routerOptions: Parameters<typeof createMemoryRouter>[1];
}

export function createWrapper({
  routes = defaultRoutes,
  routerOptions,
}: iOptions) {
  const router = createMemoryRouter(routes, routerOptions);

  return <RouterProvider router={router} />;
}

export function wipeStores() {
  nanostoresCleanStores(
    user$,
    productList$,
    activeOrder$,
    waitingForPaymentOrder$,
    initProductProviderStore$,
    product$,
    productId$,
  );
}
