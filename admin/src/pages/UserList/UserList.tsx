import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { iUser } from '../../types';
import { useStore } from '@nanostores/react';
import { $users, USER_PAGE_SIZE, setUserListPage } from '../../stores/user';

const columns: TableProps<iUser>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Surname',
    dataIndex: 'surname',
  },
  {
    title: 'Birth date',
    dataIndex: 'birthDate',
  },
  {
    title: 'phone',
    dataIndex: 'phone',
  },
];

export function UserListPage() {
  const { data, loading } = useStore($users);

  const totalPages = data?.count || 0;

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={data?.items || []}
      pagination={{
        onChange: (page) => setUserListPage(page, totalPages),
        pageSize: USER_PAGE_SIZE,
        total: totalPages,
      }}
    />
  );
}
