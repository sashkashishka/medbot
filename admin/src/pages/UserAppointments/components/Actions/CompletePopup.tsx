import { useStore } from '@nanostores/react';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import {
  $activeOrder,
  $editOrder,
  completeOrder,
} from '../../../../stores/order';
import {
  $editAppointment,
  completeAppointment,
} from '../../../../stores/appointment';
import type { iAppointment } from '../../../../types';
import { $user } from '../../../../stores/user';

interface iProps {
  appointment: iAppointment;
}

export function CompletePopup({ appointment }: iProps) {
  const [open, setOpen] = useState(false);
  const { data: activeOrder } = useStore($activeOrder);
  const { data: user } = useStore($user);

  const editAppointment = useStore($editAppointment);
  const editOrder = useStore($editOrder);

  return (
    <>
      <div onClick={() => setOpen(true)}>Complete</div>

      <Modal
        open={open}
        title="Completing an appointment"
        onCancel={() => setOpen(false)}
        footer={[
          <Button
            key="app"
            type="primary"
            loading={editAppointment.loading}
            onClick={() =>
              completeAppointment({
                user: user!,
                appointment,
              })
            }
          >
            Complete
          </Button>,
          activeOrder?.subscriptionEndsAt ? null : (
            <Button
              key="app-and-order"
              type="primary"
              loading={editAppointment.loading || editOrder.loading}
              onClick={async () => {
                const done = await completeAppointment({
                  user: user!,
                  appointment,
                });

                if (done) {
                  await completeOrder({
                    user: user!,
                    activeOrder: activeOrder!,
                  });
                }
              }}
            >
              Complete with order closing
            </Button>
          ),
          <Button key="back" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
        ]}
      >
        To mark an appointment as completed - click "Complete" button.
        <br />
        User will be notified that appointment completed.
        <br />
        {activeOrder?.subscriptionEndsAt ? null : (
          <>
            You can also complete an order with an appointment as this is one
            time order.
            <br />
            Click "Complete with order closing" button.
            <br />
            User will be notified that appointment and order closed.
            <br />
            Beware! After closing an order - you cannot send a message to user,
            and they cannot send to you either.
            <br />
            After closing an order user must create a new one and pay for it.
          </>
        )}
      </Modal>
    </>
  );
}
