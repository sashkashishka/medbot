import { useState } from 'react';
import { Button, Form, Modal, Space } from 'antd';
import { ScheduleMeeting as ReactScheduleMeeting } from 'react-schedule-meeting';
import { useStore } from '@nanostores/react';
import uk from 'date-fns/locale/uk';

import type { iAppointment } from '../../../../types';
import {
  $appointmentFreeSlots,
  $editAppointment,
  changeAppointmentTime,
} from '../../../../stores/appointment';
import { $activeOrder } from '../../../../stores/order';
import { $user } from '../../../../stores/user';

interface iProps {
  appointment: iAppointment;
}

/**
 * @deprecated
 * @description tmp do not use this component until issue with timezone has been solved
 */
export function ChangeTime({ appointment }: iProps) {
  const [open, setOpen] = useState(false);

  const { data: activeOrder } = useStore($activeOrder);
  const { data: user } = useStore($user);
  const { data: availableTimeslots } = useStore($appointmentFreeSlots);
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
            // TODO: fix issue when selected time doesn't appear
            // in data argument
            changeAppointmentTime({
              user: user!,
              activeOrder: activeOrder!,
              appointment: data,
            });
          }}
        >
          <Form.Item shouldUpdate>
            {(form) => {
              const value = form.getFieldValue('time');

              return (
                <ReactScheduleMeeting
                  // className={styles.container}
                  locale={uk}
                  borderRadius={16}
                  // textColor={themeParams.text_color}
                  // primaryColor={themeParams.button_color}
                  // backgroundColor={themeParams.secondary_bg_color}
                  eventDurationInMinutes={45}
                  availableTimeslots={availableTimeslots || []}
                  selectedStartTime={value ? new Date(value) : undefined}
                  onStartTimeSelect={(startTimeEvent) => {
                    console.log('$$$', startTimeEvent);
                    form.setFieldValue(
                      'time',
                      startTimeEvent.startTime.toISOString(),
                    );
                  }}
                  // onSelectedDayChange={console.log}
                  lang_emptyListText="Немає вільних годин"
                  lang_confirmButtonText="Підтвердити"
                  lang_cancelButtonText="Скасувати"
                  lang_goToNextAvailableDayText="Найближчі доступні години"
                  lang_noFutureTimesText="Немає доступних годин"
                  lang_selectedButtonText="Обрано:"
                  format_nextFutureStartTimeAvailableFormatString="cccc, do MMMM"
                  format_selectedDateDayTitleFormatString="cccc, do MMMM"
                  format_selectedDateMonthTitleFormatString="LLLL Y"
                  format_startTimeFormatString="HH:mm"
                />
              );
            }}
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
