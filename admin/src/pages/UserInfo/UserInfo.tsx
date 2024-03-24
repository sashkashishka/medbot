import { useStore } from '@nanostores/react';
import { $userDescriptionItems } from '../../stores/user';
import { Descriptions } from 'antd';

export function UserInfoPage() {
  const items = useStore($userDescriptionItems);

  return <Descriptions items={items!} />;
}
