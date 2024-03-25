import { Button, Descriptions, Flex, Form, type DescriptionsProps } from 'antd';
import type { iAppointment } from '../../../../types';
import { EditableCell } from './EditableCell';
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { createAppointmentDetailsFormPersister } from '../../../../stores/appointment';

interface iProps {
  appointment: iAppointment;
}

export function ExpandableAppointmentDetails({ appointment }: iProps) {
  const [editing, setEditing] = useState(false);
  const [{ $store: $persistedAppointment, persistValues }] = useState(
    createAppointmentDetailsFormPersister(appointment),
  );
  const persistedAppointment = useStore($persistedAppointment);

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
  ];

  return (
    <Form
      initialValues={persistedAppointment}
      onValuesChange={(_changed, values) => persistValues(values)}
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
