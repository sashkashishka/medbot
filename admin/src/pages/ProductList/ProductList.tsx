import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { iProduct } from '../../types';
import { useStore } from '@nanostores/react';
import { $products } from '../../stores/product';

const columns: TableProps<iProduct>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Price',
    dataIndex: 'price',
  },
  {
    title: 'Member quantity',
    dataIndex: 'memberQty',
  },
  {
    title: 'Subscription duration',
    dataIndex: 'subscriptionDuration',
  },
];

export function ProductListPage() {
  const { data, loading } = useStore($products);

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data || []}
      pagination={false}
    />
  );
}
