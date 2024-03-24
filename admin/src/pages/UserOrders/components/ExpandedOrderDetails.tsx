import { Button, Flex, Typography, Popconfirm } from 'antd';
import type { iOrder } from '../../../types';

interface iProps {
  order: iOrder;
}

export function ExpandedOrderDetails({ order }: iProps) {
  if (order.subscriptionEndsAt) {
    return (
      <Typography.Text>
        This is subscription order. It closes automatically at the end of
        subscription
      </Typography.Text>
    );
  }

  return (
    <Flex>
      <Typography.Text>
        This is one time order. Close it when you end you appointment with
        customer.
      </Typography.Text>

      <Popconfirm
        title="Sure to close?"
        onConfirm={() => console.log('delete')}
      >
        <Button danger>Close order</Button>
      </Popconfirm>
    </Flex>
  );
}
