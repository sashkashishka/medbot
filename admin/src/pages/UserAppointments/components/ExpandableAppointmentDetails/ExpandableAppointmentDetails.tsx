import {
  Button,
  Descriptions,
  Flex,
  Form,
  notification,
  type DescriptionsProps,
} from 'antd';
import type { iAppointment } from '../../../../types';
import { EditableCell } from './EditableCell';
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import {
  $prescriptAppointment,
  createAppointmentDetailsFormPersister,
} from '../../../../stores/appointment';

interface iProps {
  appointment: iAppointment;
}

export function ExpandableAppointmentDetails({ appointment }: iProps) {
  const [editing, setEditing] = useState(false);
  const [{ $store: $persistedAppointment, persistValues }] = useState(
    createAppointmentDetailsFormPersister(appointment),
  );
  const persistedAppointment = useStore($persistedAppointment);
  const { mutate } = useStore($prescriptAppointment);

  const items: DescriptionsProps['items'] = [
    {
      key: 'complaints',
      label: 'Complaints',
      children: appointment.complaints,
    },
    {
      key: 'complaintsStarted',
      label: 'Complaint started',
      children: appointment.complaintsStarted,
    },
    {
      key: 'medicine',
      label: 'Medicine',
      children: appointment.medicine,
    },
    {
      key: 'chronicDiseases',
      label: 'Chronic diseases',
      children: appointment.chronicDiseases,
    },
    {
      key: 'report',
      label: 'Report',
      children: (
        <EditableCell
          name="report"
          value={appointment.report}
          editing={editing}
        />
      ),
    },
    {
      key: 'treatment',
      label: 'Treatment',
      children: (
        <EditableCell
          name="treatment"
          value={appointment.treatment}
          editing={editing}
        />
      ),
    },
    {
      key: 'notes',
      label: 'Notes',
      children: (
        <EditableCell
          name="notes"
          value={appointment.notes}
          editing={editing}
        />
      ),
    },
  ];

  async function onFinish(data: iAppointment) {
    try {
      const resp = (await mutate({
        ...appointment,
        ...data,
      })) as Response;
      const respData = await resp.json();

      if (resp.ok) {
        return setEditing(false);
      }

      if ('error' in respData || 'reason' in respData) {
        return notification.error({
          message: respData.error || respData.reason,
        });
      }

      throw respData;
    } catch (e) {
      console.error(e);
      notification.error({ message: 'Unexpected error' });
    }
  }

  return (
    <Form
      initialValues={persistedAppointment}
      onValuesChange={(_changed, values) => persistValues(values)}
      onFinish={onFinish}
    >
      <Descriptions
        items={items}
        layout="vertical"
        column={1}
        title="Medical card"
        extra={
          editing ? (
            <Flex style={{ gap: '16px' }}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button type="default" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </Flex>
          ) : (
            <Button type="dashed" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )
        }
      />
    </Form>
  );
}
