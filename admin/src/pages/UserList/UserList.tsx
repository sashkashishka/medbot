import { useLayoutEffect } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { useSearchParams, Link, generatePath } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import type { iUser } from '../../types';
import { $users, USER_PAGE_SIZE, setUserListPage } from '../../stores/user';
import { formatDate } from '../../utils/date';
import { ROUTES } from '../../constants/routes';

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
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
  const { data, loading } = useStore($users);

  const page = Number(searchParams.get('page'));
  const totalPages = data?.count || 0;

  useLayoutEffect(() => {
    setUserListPage(page, Infinity);
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
          setUserListPage(newPage, totalPages);
        },
        pageSize: USER_PAGE_SIZE,
        total: totalPages,
      }}
    />
  );
}
