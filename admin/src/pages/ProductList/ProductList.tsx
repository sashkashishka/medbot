import { Button, Flex, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { Link, generatePath } from 'react-router-dom';
import type { iProduct } from '../../types';
import { useStore } from '@nanostores/react';
import { $products } from '../../stores/product';
import { ROUTES } from '../../constants/routes';

const columns: TableProps<iProduct>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    render(text, item) {
      return (
        <Link to={generatePath(ROUTES.EDIT_PRODUCT, { id: String(item.id) })}>
          {text}
        </Link>
      );
    },
  },
  {
    title: 'Price UAH',
    dataIndex: 'price',
  },
  {
    title: 'Member quantity',
    dataIndex: 'memberQty',
  },
  {
    title: 'Subscription duration (month)',
    dataIndex: 'subscriptionDuration',
  },
];

export function ProductListPage() {
  const { data, loading } = useStore($products);

  return (
    <>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Typography.Title level={3}>Product list</Typography.Title>

        <Link to={ROUTES.CREATE_PRODUCT}>
          <Button type="primary">Add new product</Button>
        </Link>
      </Flex>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data || []}
        pagination={false}
      />
    </>
  );
}
