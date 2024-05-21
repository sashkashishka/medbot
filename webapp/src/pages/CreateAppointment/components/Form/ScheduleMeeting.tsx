import { useField } from 'react-final-form';
import { ScheduleMeeting as ReactScheduleMeeting } from 'react-schedule-meeting';
import { useStore } from '@nanostores/react';
import uk from 'date-fns/locale/uk';

import { $availableTimeslots } from '../../../../stores/appointment';
import { getThemeParams } from '../../../../utils/tg';
import { required } from '../../../../utils/final-form';
import { ValidationError } from '../../../../components/ValidationError';
import { $t } from '../../../../stores/i18n';

import styles from './ScheduleMeeting.module.css';

export function ScheduleMeeting() {
  const availableTimeslots = useStore($availableTimeslots);
  const t = useStore($t);
  const { input, meta } = useField<string>('time', {
    validateFields: [],
    validate: required(t.validationRequiredField),
  });

  const themeParams = getThemeParams();

  return (
    <div className={styles.wrapper}>
      <ValidationError fieldMeta={meta} className={styles.error} />

      <ReactScheduleMeeting
        className={styles.container}
        locale={uk}
        borderRadius={16}
        textColor={themeParams.text_color}
        primaryColor={themeParams.button_color}
        backgroundColor={themeParams.secondary_bg_color}
        eventDurationInMinutes={45}
        availableTimeslots={availableTimeslots}
        selectedStartTime={input.value ? new Date(input.value) : undefined}
        onStartTimeSelect={(startTimeEvent) =>
          input.onChange(startTimeEvent.startTime.toISOString())
        }
        onSelectedDayChange={console.log}
        lang_emptyListText={t.scheduleMeeting_emptyListText}
        lang_confirmButtonText={t.scheduleMeeting_confirmButtonText}
        lang_cancelButtonText={t.scheduleMeeting_cancelButtonText}
        lang_goToNextAvailableDayText={
          t.scheduleMeeting_goToNextAvailableDayText
        }
        lang_noFutureTimesText={t.scheduleMeeting_noFutureTimesText}
        lang_selectedButtonText={t.scheduleMeeting_selectedButtonText}
        format_nextFutureStartTimeAvailableFormatString="cccc, do MMMM"
        format_selectedDateDayTitleFormatString="cccc, do MMMM"
        format_selectedDateMonthTitleFormatString="LLLL Y"
        format_startTimeFormatString="HH:mm"
      />
    </div>
  );
}
