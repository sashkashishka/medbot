import { useField } from 'react-final-form';
import { ScheduleMeeting as ReactScheduleMeeting } from 'react-schedule-meeting';
import { useStore } from '@nanostores/react';
import uk from 'date-fns/locale/uk';

import { freeSlots$ } from '../../../../stores/appointment';
import { getThemeParams } from '../../../../utils/tg';
import { required } from '../../../../utils/final-form';
import { ValidationError } from '../../../../components/ValidationError';

import styles from './ScheduleMeeting.module.css';

export function ScheduleMeeting() {
  const { data, loading, error } = useStore(freeSlots$);
  const { input, meta } = useField<string>('time', {
    validateFields: [],
    validate: required('Обовʼязкове поле'),
  });

  const themeParams = getThemeParams();

  if (loading || error) {
    return null;
  }

  return (
    <>
      <ReactScheduleMeeting
        className={styles.container}
        locale={uk}
        borderRadius={16}
        textColor={themeParams.text_color}
        primaryColor={themeParams.button_color}
        backgroundColor={themeParams.secondary_bg_color}
        eventDurationInMinutes={45}
        availableTimeslots={data!}
        startTimeListStyle="scroll-list"
        selectedStartTime={input.value ? new Date(input.value) : undefined}
        onStartTimeSelect={(startTimeEvent) =>
          input.onChange(startTimeEvent.startTime.toISOString())
        }
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
      <ValidationError fieldMeta={meta} />
    </>
  );
}
