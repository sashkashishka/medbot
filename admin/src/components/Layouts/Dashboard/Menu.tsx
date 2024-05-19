import { Menu, type MenuProps } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const items: MenuProps['items'] = [
  {
    key: ROUTES.DASHBOARD,
    label: <Link to={ROUTES.DASHBOARD}>Main page</Link>,
  },
  {
    key: ROUTES.PRODUCTS,
    label: <Link to={ROUTES.PRODUCTS}>Product list</Link>,
  },
  { key: ROUTES.USERS, label: <Link to={ROUTES.USERS}>User list</Link> },
  {
    key: ROUTES.ORDERS,
    label: <Link to={ROUTES.ORDERS}>Order list</Link>,
  },
  {
    key: ROUTES.APPOINTMENTS,
    label: <Link to={ROUTES.APPOINTMENTS}>Appointment list</Link>,
  },
  {
    key: ROUTES.I18N,
    label: <Link to={ROUTES.I18N}>Translations</Link>,
  },
];

export function SidebarMenu() {
  const { pathname } = useLocation();

  return (
    <Menu theme="dark" selectedKeys={[pathname]} mode="inline" items={items} />
  );
}
