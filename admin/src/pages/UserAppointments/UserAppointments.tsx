import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { useStore } from '@nanostores/react';
import type { iAppointment } from '../../types';
import {
  $appointmentListFilters,
  $appointments,
  APPOINTMENT_PAGE_SIZE,
  setAppointmentListFilter,
} from '../../stores/appointment';
import { useSyncQueryFilters } from '../../hooks/useSyncQueryFilters';
import { StatusTag } from '../../components/StatusTag';
import { formatDate } from '../../utils/date';
import { ExpandableAppointmentDetails } from './components/ExpandableAppointmentDetails';
import { AppointmentActions } from './components/Actions';
import { googleCalendarEventLink } from '../../utils/googleCalendarEventLink';
import { $adminConfig } from '../../stores/admin';

export function UserAppointmentsPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data, loading } = useStore($appointments);
  const { data: adminConfig } = useStore($adminConfig);
  const appointmentListFilters = useStore($appointmentListFilters);
  useSyncQueryFilters($appointmentListFilters);

  const totalPages = data?.count || 0;

  useLayoutEffect(() => {
    setAppointmentListFilter('user_id', userId);
  }, [userId]);

  const columns: TableProps<iAppointment>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Order',
      dataIndex: 'orderId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: 'Meeting time',
      dataIndex: 'time',
      render: formatDate,
    },
    {
      title: 'Calendar event',
      dataIndex: 'calendarEventId',
      render: (calendarId) => (
        <a
          href={googleCalendarEventLink({
            id: calendarId,
            email: adminConfig?.googleEmail!,
          })}
        >
          go to calendar
        </a>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'time',
      render: (_, record) => <AppointmentActions appointment={record} />,
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
      expandable={{
        expandedRowRender: (record) => (
          <ExpandableAppointmentDetails appointment={record} />
        ),
      }}
    />
  );
}
