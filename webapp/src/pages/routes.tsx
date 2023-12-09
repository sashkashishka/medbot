import { WebAppProvider } from '../components/WebAppProvider';
import { AppProvider } from '../components/AppProvider';

import { ROUTES } from '../constants/routes';
import { MainPage } from './Main';
import { ProductListPage } from './ProductList';
import { ProductDetailPage } from './ProductDetail';
import { CheckoutPage } from './Checkout';

export const routes = [
  {
    path: ROUTES.MAIN,
    element: (
      <WebAppProvider>
        <AppProvider>
          <MainPage />
        </AppProvider>
      </WebAppProvider>
    ),
    children: [
      {
        path: ROUTES.PRODUCTS,
        element: <ProductListPage />,
      },
      {
        path: ROUTES.PRODUCT_ITEM,
        element: <ProductDetailPage />,
      },
      {
        path: ROUTES.CHECKOUT,
        element: <CheckoutPage />,
      },
    ],
  },
];
