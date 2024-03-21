import { Outlet } from 'react-router-dom';

import { PrivateRoute } from '../components/PrivateRoute';
import { AuthLayout } from '../components/Layouts/Auth';

import { ROUTES } from '../constants/routes';

import { LoginPage } from './Login';
import { RegisterPage } from './Register';
import { ProductListPage } from './ProductList';
import { UserListPage } from './UserList';
import { OrderListPage } from './OrderList';
import { AppointmentListPage } from './AppointmentList';
import { AppProvider } from '../components/Providers/App';

export const routes = [
  {
    path: ROUTES.ROOT,
    element: (
      <AppProvider>
        <Outlet />
      </AppProvider>
    ),
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <PrivateRoute predicate redirectTo={ROUTES.DASHBOARD}>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <PrivateRoute predicate redirectTo={ROUTES.DASHBOARD}>
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <PrivateRoute>
            <Outlet />
          </PrivateRoute>
        ),
        children: [
          {
            path: ROUTES.PRODUCTS,
            element: <ProductListPage />,
          },
          {
            path: ROUTES.USERS,
            element: <UserListPage />,
          },
          {
            path: ROUTES.ORDERS,
            element: <OrderListPage />,
          },
          {
            path: ROUTES.APPOINTMENTS,
            element: <AppointmentListPage />,
          },
        ],
      },
    ],
  },
];
