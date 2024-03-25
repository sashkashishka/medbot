import { Button, Flex, Typography, Popconfirm } from 'antd';
import type { iOrder } from '../../../types';
import { completeOrder } from '../../../stores/order';
import { useStore } from '@nanostores/react';
import { $user } from '../../../stores/user';

interface iProps {
  order: iOrder;
}

export function ExpandedOrderDetails({ order }: iProps) {
  const { data: user } = useStore($user);

  if (order.subscriptionEndsAt) {
    return (
      <Typography.Text>
        This is subscription order. It closes automatically at the end of
        subscription
      </Typography.Text>
    );
  }

  return (
    <Flex align="center" style={{ gap: '16px' }}>
      <Typography.Text>
        This is one time order. Close it when you end you appointment with
        customer.
      </Typography.Text>

      <Popconfirm
        title="Sure to close?"
        onConfirm={() => completeOrder({ activeOrder: order, user: user! })}
      >
        <Button danger>Close order</Button>
      </Popconfirm>
    </Flex>
  );
}
