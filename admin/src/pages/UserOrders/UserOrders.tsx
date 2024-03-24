import { Table } from 'antd';
import type { TableProps } from 'antd';
import { useStore } from '@nanostores/react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import type { iOrder } from '../../types';
import {
  $orderListFilters,
  $orders,
  ORDER_PAGE_SIZE,
  setOrderListFilter,
  setOrderListPage,
  type iOrderListFilters,
} from '../../stores/order';
import { formatDate } from '../../utils/date';
import { ProductCell } from './components/ProductCell';
import { StatusTag } from '../../components/StatusTag';
import { ExpandedOrderDetails } from './components/ExpandedOrderDetails';

export function UserOrdersPage() {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
  const { data, loading } = useStore($orders);
  const orderListFilters = useStore($orderListFilters);

  const page = Number(searchParams.get('page'));
  const totalPages = data?.count || 0;

  useLayoutEffect(() => {
    setOrderListPage(page, Infinity);
  }, []);

  useLayoutEffect(() => {
    setOrderListFilter('user_id', userId);
  }, [userId]);

  const columns: TableProps<iOrder>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Product',
      dataIndex: 'productId',
      render: (productId) => <ProductCell productId={productId} />,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      render: formatDate,
      sorter: true,
      sortOrder: `${orderListFilters.date_sort}end`,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <StatusTag status={status} />,
      filtered: true,
      filters: [
        {
          value: 'ACTIVE',
          text: 'Only active',
        },
      ],
    },
    {
      title: 'Subscription end',
      dataIndex: 'subscriptionEndsAt',
      render: formatDate,
      filtered: true,
      filters: [
        {
          value: 1,
          text: 'Only subsciption',
        },
      ],
    },
  ];

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
      expandable={{
        expandedRowRender: (record) => <ExpandedOrderDetails order={record} />,
        rowExpandable: (record) => record.status === 'ACTIVE',
      }}
      onChange={(_pagination, filters, sorter) => {
        setOrderListFilter(
          'status',
          filters?.status?.[0] as iOrderListFilters['status'],
        );
        setOrderListFilter(
          'has_subscription',
          filters
            ?.subscriptionEndsAt?.[0] as iOrderListFilters['has_subscription'],
        );

        if (Array.isArray(sorter)) return;

        if (sorter.field === 'createdAt') {
          setOrderListFilter(
            'date_sort',
            sorter.order?.replace?.(
              'end',
              '',
            ) as iOrderListFilters['date_sort'],
          );
        }
      }}
    />
  );
}
