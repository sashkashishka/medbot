import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { iOrder } from '../../types';
import { useStore } from '@nanostores/react';
import {
  $orderListFilters,
  $orders,
  ORDER_PAGE_SIZE,
  setOrderListFilter,
} from '../../stores/order';
import { formatDate } from '../../utils/date';
import { useSyncQueryFilters } from '../../hooks/useSyncQueryFilters';

const columns: TableProps<iOrder>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Created',
    dataIndex: 'createdAt',
    render: formatDate,
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
    render: formatDate,
  },
];

export function OrderListPage() {
  const { data, loading } = useStore($orders);
  const orderListFilters = useStore($orderListFilters);
  useSyncQueryFilters($orderListFilters);

  const totalPages = data?.count || 0;

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data?.items || []}
      pagination={{
        current: orderListFilters.page,
        onChange: (newPage) => {
          setOrderListFilter('page', newPage);
        },
        pageSize: ORDER_PAGE_SIZE,
        total: totalPages,
      }}
    />
  );
}
