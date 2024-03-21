import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { iOrder } from '../../types';
import { useStore } from '@nanostores/react';
import { $orders, ORDER_PAGE_SIZE, setOrderListPage } from '../../stores/order';

const columns: TableProps<iOrder>['columns'] = [
  {
    title: 'Created',
    dataIndex: 'createdAt',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'User',
    dataIndex: 'userId',
  },
  {
    title: 'Product',
    dataIndex: 'productId',
  },
  {
    title: 'Subscription ends at',
    dataIndex: 'subscriptionEndsAt',
  },
];

export function OrderListPage() {
  const { data, loading } = useStore($orders);

  const totalPages = data?.count || 0;

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={data?.items || []}
      pagination={{
        onChange: (page) => setOrderListPage(page, totalPages),
        pageSize: ORDER_PAGE_SIZE,
        total: totalPages,
      }}
    />
  );
}
