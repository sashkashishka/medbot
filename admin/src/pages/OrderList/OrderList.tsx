import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { iOrder } from '../../types';
import { useStore } from '@nanostores/react';
import { $orders, ORDER_PAGE_SIZE, setOrderListPage } from '../../stores/order';
import { formatDate } from '../../utils/date';
import { useSearchParams } from 'react-router-dom';
import { useLayoutEffect } from 'react';

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
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
  const { data, loading } = useStore($orders);

  const page = Number(searchParams.get('page'));
  const totalPages = data?.count || 0;

  useLayoutEffect(() => {
    setOrderListPage(page, Infinity);
  }, []);

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data?.items || []}
      pagination={{
        current: page,
        onChange: (newPage) => {
          setSearchParams({ page: String(newPage) });
          setOrderListPage(newPage, totalPages);
        },
        pageSize: ORDER_PAGE_SIZE,
        total: totalPages,
      }}
    />
  );
}
