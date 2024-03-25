import { Table } from 'antd';
import type { TableProps } from 'antd';
import { useStore } from '@nanostores/react';
import { Link, generatePath } from 'react-router-dom';
import type { iAppointment } from '../../types';
import {
  $appointmentListFilters,
  $appointments,
  APPOINTMENT_PAGE_SIZE,
  setAppointmentListFilter,
  type iAppointmentListFilters,
} from '../../stores/appointment';
import { useSyncQueryFilters } from '../../hooks/useSyncQueryFilters';
import { ROUTES } from '../../constants/routes';
import { StatusTag } from '../../components/StatusTag';
import { formatDate } from '../../utils/date';

export function AppointmentListPage() {
  const { data, loading } = useStore($appointments);
  const appointmentListFilters = useStore($appointmentListFilters);
  useSyncQueryFilters($appointmentListFilters);

  const totalPages = data?.count || 0;

  const columns: TableProps<iAppointment>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'User',
      dataIndex: 'userId',
      render(id: string) {
        return <Link to={generatePath(ROUTES.USER, { userId: id })}>{id}</Link>;
      },
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
      filteredValue: [appointmentListFilters.status!],
    },
    {
      title: 'Meeting time',
      dataIndex: 'time',
      render: formatDate,
    },
  ];

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data?.items || []}
      pagination={{
        current: appointmentListFilters.page,
        onChange: (newPage) => {
          setAppointmentListFilter('page', newPage);
        },
        pageSize: APPOINTMENT_PAGE_SIZE,
        total: totalPages,
      }}
      onChange={(_pagination, filters) => {
        setAppointmentListFilter(
          'status',
          filters?.status?.[0] as iAppointmentListFilters['status'],
        );
      }}
    />
  );
}
