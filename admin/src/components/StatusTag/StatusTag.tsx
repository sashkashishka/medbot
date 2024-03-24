import { Tag } from 'antd';
import type { iAppointment, iOrder } from '../../types';

interface iProps {
  status: iOrder['status'] | iAppointment['status'];
}
export function StatusTag({ status }: iProps) {
  switch (status) {
    case 'ACTIVE':
      return <Tag color="blue">{status}</Tag>;

    case 'DONE':
      return <Tag color="green">{status}</Tag>;

    case 'DELETED':
      return <Tag color="red">{status}</Tag>;

    case 'WAITING_FOR_PAYMENT':
    default:
      return <Tag color="default">{status}</Tag>;
  }
}
