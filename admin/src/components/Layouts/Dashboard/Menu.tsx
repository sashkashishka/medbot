import { Menu, type MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useState } from 'react';

const items: MenuProps['items'] = [
  { key: ROUTES.DASHBOARD, label: 'Main page' },
  { key: ROUTES.PRODUCTS, label: 'Product list' },
  { key: ROUTES.USERS, label: 'User list' },
  { key: ROUTES.ORDERS, label: 'Order list' },
  { key: ROUTES.APPOINTMENTS, label: 'Appointment list' },
];

export function SidebarMenu() {
  const [currItem, setCurrItem] = useState([ROUTES.DASHBOARD]);
  const navigate = useNavigate();

  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={currItem}
      mode="inline"
      items={items}
      onClick={({ key }) => {
        setCurrItem([key as ROUTES]);
        navigate(key as ROUTES);
      }}
    />
  );
}
