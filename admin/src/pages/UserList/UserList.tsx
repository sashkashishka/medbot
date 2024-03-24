import { Table } from 'antd';
import type { TableProps } from 'antd';
import { Link, generatePath } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import type { iUser } from '../../types';
import {
  $userListFilters,
  $users,
  USER_PAGE_SIZE,
  setUserListFilter,
} from '../../stores/user';
import { formatDate } from '../../utils/date';
import { ROUTES } from '../../constants/routes';
import { useSyncQueryFilters } from '../../hooks/useSyncQueryFilters';

const columns: TableProps<iUser>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    render(id: string) {
      return <Link to={generatePath(ROUTES.USER, { userId: id })}>{id}</Link>;
    },
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Surname',
    dataIndex: 'surname',
  },
  {
    title: 'Patronymic',
    dataIndex: 'patronymic',
  },
  {
    title: 'Birth date',
    dataIndex: 'birthDate',
    render: formatDate,
  },
  {
    title: 'phone',
    dataIndex: 'phone',
  },
];

export function UserListPage() {
  const { data, loading } = useStore($users);
  const userListFilters = useStore($userListFilters);
  useSyncQueryFilters($userListFilters);

  const totalPages = data?.count || 0;

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data?.items || []}
      pagination={{
        current: userListFilters.page,
        onChange: (newPage) => {
          setUserListFilter('page', newPage);
        },
        pageSize: USER_PAGE_SIZE,
        total: totalPages,
      }}
    />
  );
}
