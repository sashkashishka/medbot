import { useLayoutEffect } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { useSearchParams } from 'react-router-dom';
import type { iAppointment } from '../../types';
import { useStore } from '@nanostores/react';
import {
  $appointments,
  APPOINTMENT_PAGE_SIZE,
  setAppointmentListPage,
} from '../../stores/appointment';

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

export function AppointmentListPage() {
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
  const { data, loading } = useStore($appointments);

  const page = Number(searchParams.get('page'));
  const totalPages = data?.count || 0;

  useLayoutEffect(() => {
    setAppointmentListPage(page, Infinity);
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
          setAppointmentListPage(newPage, totalPages);
        },
        pageSize: APPOINTMENT_PAGE_SIZE,
        total: totalPages,
      }}
    />
  );
}
