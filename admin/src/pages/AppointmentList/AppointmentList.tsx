import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { iAppointment } from '../../types';
import { useStore } from '@nanostores/react';
import {
  $appointments,
  APPOINTMENT_PAGE_SIZE,
  setAppointmentListPage,
} from '../../stores/appointment';

const columns: TableProps<iAppointment>['columns'] = [
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

export function AppointmentListPage() {
  const { data, loading } = useStore($appointments);

  const totalPages = data?.count || 0;

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={data?.items || []}
      pagination={{
        onChange: (page) => setAppointmentListPage(page, totalPages),
        pageSize: APPOINTMENT_PAGE_SIZE,
        total: totalPages,
      }}
    />
  );
}
