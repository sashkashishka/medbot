import { useState } from 'react';
import { Button, Form, Modal, Space } from 'antd';
import { useStore } from '@nanostores/react';

import type { iAppointment } from '../../../../types';
import {
  $editAppointment,
  changeAppointmentTime,
} from '../../../../stores/appointment';
import { $user } from '../../../../stores/user';
import { ScheduleMeeting } from '../ScheduleMeeting';

interface iProps {
  appointment: iAppointment;
}

export function ChangeTime({ appointment }: iProps) {
  const [open, setOpen] = useState(false);

  const { data: user } = useStore($user);
  const editAppointment = useStore($editAppointment);

  return (
    <>
      <div onClick={() => setOpen(true)}>Change time</div>

      <Modal
        open={open}
        title="Change appointment time"
        onCancel={() => setOpen(false)}
        footer={[]}
        width="75vw"
      >
        <Form
          initialValues={appointment}
          onFinish={(data) => {
            changeAppointmentTime({
              user: user!,
              appointment: { ...appointment, ...data },
            });
          }}
        >
          <Form.Item name="time" noStyle shouldUpdate>
            <ScheduleMeeting />
          </Form.Item>

          <Space>
            <Button
              key="app"
              type="primary"
              htmlType="submit"
              loading={editAppointment.loading}
            >
              Change time
            </Button>
            <Button key="back" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
}
