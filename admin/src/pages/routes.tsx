import { Outlet } from 'react-router-dom';

import { PrivateRoute } from '../components/PrivateRoute';
import { AuthLayout } from '../components/Layouts/Auth';
import { DashboardLayout } from '../components/Layouts/Dashboard';
import { AppProvider } from '../components/Providers/App';

import { ROUTES } from '../constants/routes';

import { LoginPage } from './Login';
import { RegisterPage } from './Register';
import { ProductListPage } from './ProductList';
import { UserListPage } from './UserList';
import { OrderListPage } from './OrderList';
import { AppointmentListPage } from './AppointmentList';
import { DashboardPage } from './Dashboard';
import { ProductPage } from './Product';
import { UserPage } from './User';
import { UserOrdersPage } from './UserOrders';
import { UserAppointmentsPage } from './UserAppointments';
import { UserInfoPage } from './UserInfo';
import { I18nPage } from './I18n';
import { I18nNamespacePage } from './I18nNamespace';
import { I18nTranslationPage } from './I18nTranslation';

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
        path: ROUTES.ROOT,
        element: (
          <PrivateRoute predicate redirectTo={ROUTES.DASHBOARD}>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PrivateRoute>
        ),
      },
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
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        ),
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <PrivateRoute>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </PrivateRoute>
        ),
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: <DashboardPage />,
          },

          {
            path: ROUTES.PRODUCTS,
            element: <ProductListPage />,
          },
          {
            path: ROUTES.CREATE_PRODUCT,
            element: <ProductPage />,
          },
          {
            path: ROUTES.EDIT_PRODUCT,
            element: <ProductPage />,
          },
          {
            path: ROUTES.USERS,
            element: <UserListPage />,
          },
          {
            path: ROUTES.USER,
            element: <UserPage />,
            children: [
              {
                path: ROUTES.USER,
                element: <UserInfoPage />,
              },
              {
                path: ROUTES.USER_ORDERS,
                element: <UserOrdersPage />,
              },
              {
                path: ROUTES.USER_APPOINTMENTS,
                element: <UserAppointmentsPage />,
              },
            ],
          },
          {
            path: ROUTES.ORDERS,
            element: <OrderListPage />,
          },
          {
            path: ROUTES.APPOINTMENTS,
            element: <AppointmentListPage />,
          },
          {
            path: ROUTES.I18N,
            element: <I18nPage />,
          },
          {
            path: ROUTES.I18N_NAMESPACE,
            element: <I18nNamespacePage />,
          },
          {
            path: ROUTES.I18N_CREATE,
            element: <I18nTranslationPage />,
          },
          {
            path: ROUTES.I18N_UPDATE,
            element: <I18nTranslationPage />,
          },
        ],
      },
    ],
  },
];
