import { useMemo } from 'react';
import { Tabs, type TabsProps } from 'antd';
import { ROUTES } from '../../constants/routes';
import { Link, Outlet, generatePath, useLocation } from 'react-router-dom';

function getItems(userId: string): TabsProps['items'] {
  const infoPath = generatePath(ROUTES.USER, { userId });
  const ordersPath = generatePath(ROUTES.USER_ORDERS, { userId });
  const appointmentsPath = generatePath(ROUTES.USER_APPOINTMENTS, { userId });

  return [
    {
      key: infoPath,
      label: <Link to={infoPath}>Info</Link>,
      children: <Outlet />,
    },
    {
      key: ordersPath,
      label: <Link to={ordersPath}>Orders</Link>,
      children: <Outlet />,
    },
    {
      key: appointmentsPath,
      label: <Link to={appointmentsPath}>Appointments</Link>,
      children: <Outlet />,
    },
  ];
}

interface iProps {
  userId: string;
}

export function UserTabs({ userId }: iProps) {
  const { pathname } = useLocation();
  const items = useMemo(() => getItems(userId), [userId]);

  return <Tabs activeKey={pathname} items={items} />;
}
