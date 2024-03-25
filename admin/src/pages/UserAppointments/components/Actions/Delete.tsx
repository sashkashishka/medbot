import { useState } from 'react';
import { Modal, Button } from 'antd';
import { useStore } from '@nanostores/react';
import type { iAppointment } from '../../../../types';
import {
  $deleteAppointment,
  deleteAppointment,
} from '../../../../stores/appointment';
import { $user } from '../../../../stores/user';

interface iProps {
  appointment: iAppointment;
}

export function DeleteAppointment({ appointment }: iProps) {
  const [open, setOpen] = useState(false);
  const { data: user } = useStore($user);

  const { loading } = useStore($deleteAppointment);

  return (
    <>
      <div onClick={() => setOpen(true)}>Delete</div>

      <Modal
        open={open}
        title="Delete appointment?"
        onCancel={() => setOpen(false)}
        footer={[
          <Button
            key="app"
            type="primary"
            loading={loading}
            onClick={() =>
              deleteAppointment({
                user: user!,
                appointment,
              })
            }
          >
            Delete
          </Button>,
          <Button key="back" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
        ]}
      />
    </>
  );
}
