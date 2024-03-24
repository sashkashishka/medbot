import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { iAppointment } from '../../types';
import { useStore } from '@nanostores/react';
import {
  $appointmentListFilters,
  $appointments,
  APPOINTMENT_PAGE_SIZE,
  setAppointmentListFilter,
} from '../../stores/appointment';
import { useSyncQueryFilters } from '../../hooks/useSyncQueryFilters';

const columns: TableProps<iAppointment>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Appointment ID',
    dataIndex: 'orderId',
  },
  {
    title: 'User',
    dataIndex: 'userId',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Complaints',
    dataIndex: 'complaints',
  },
];

export function UserAppointmentsPage() {
  const { data, loading } = useStore($appointments);
  const appointmentListFilters = useStore($appointmentListFilters);
  useSyncQueryFilters($appointmentListFilters);

  const totalPages = data?.count || 0;

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
    />
  );
}
