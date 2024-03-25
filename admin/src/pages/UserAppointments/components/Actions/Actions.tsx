import { type DropDownProps, Dropdown, Button } from 'antd';
import type { iAppointment } from '../../../../types';
import { CompletePopup } from './CompletePopup';
// import { ChangeTime } from './ChangeTime';
import { DeleteAppointment } from './Delete';

interface iProps {
  appointment: iAppointment;
}

export function AppointmentActions({ appointment }: iProps) {
  if (appointment.status !== 'ACTIVE') return '-';

  const menu: DropDownProps['menu'] = {
    items: [
      // {
      //   key: '1',
      //   label: <ChangeTime appointment={appointment} />,
      // },
      {
        key: '2',
        label: <DeleteAppointment appointment={appointment} />,
        danger: true,
      },
      {
        key: '3',
        label: <CompletePopup appointment={appointment} />,
      },
    ],
  };

  return (
    <Dropdown menu={menu}>
      <Button>Open actions</Button>
    </Dropdown>
  );
}
