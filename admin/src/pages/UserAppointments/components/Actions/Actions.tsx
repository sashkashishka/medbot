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
      // NOTE: issue is with timezoneOffset.
      // For instance, user created event and set offset to 60.
      // Doctor want to change date and set other time.
      // And all will work if this is not spring or autum.
      // In this period of time there are DTS shifts.
      // To avoid this - I need to know in some way timezone itself in IANA format
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
