import { Table } from 'antd';
import type { TableProps } from 'antd';
import { useStore } from '@nanostores/react';
import { useParams } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import type { iOrder } from '../../types';
import {
  $orderListFilters,
  $orders,
  ORDER_PAGE_SIZE,
  setOrderListFilter,
  type iOrderListFilters,
} from '../../stores/order';
import { formatDate } from '../../utils/date';
import { ProductCell } from '../../components/ProductCell';
import { StatusTag } from '../../components/StatusTag';
import { ExpandedOrderDetails } from './components/ExpandedOrderDetails';
import { useSyncQueryFilters } from '../../hooks/useSyncQueryFilters';

export function UserOrdersPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data, loading } = useStore($orders);
  const orderListFilters = useStore($orderListFilters);
  useSyncQueryFilters($orderListFilters);

  const totalPages = data?.count || 0;

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
      filteredValue: [orderListFilters.status!],
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
      filteredValue: [orderListFilters.has_subscription!],
    },
  ];

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
