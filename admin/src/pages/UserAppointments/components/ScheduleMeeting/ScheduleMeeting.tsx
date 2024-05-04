import { useMemo } from "react";
import { useStore } from "@nanostores/react";
import { addMinutes } from "date-fns";
import uk from 'date-fns/locale/uk';
import { ScheduleMeeting as ReactScheduleMeeting } from 'react-schedule-meeting';

import { $appointmentFreeSlots } from "../../../../stores/appointment";

export function ScheduleMeeting({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (v: string) => void;
}) {
  const { data: appointmentFreeSlots } = useStore($appointmentFreeSlots);

  const freeSlots = useMemo(() => {
    return appointmentFreeSlots && value
      ? appointmentFreeSlots.concat({
          id: value,
          startTime: value,
          endTime: addMinutes(new Date(value), 60).toISOString(),
        })
      : [];
  }, [appointmentFreeSlots]);

  return (
    <ReactScheduleMeeting
      locale={uk}
      borderRadius={16}
      eventDurationInMinutes={45}
      availableTimeslots={freeSlots}
      selectedStartTime={value ? new Date(value) : undefined}
      onStartTimeSelect={(startTimeEvent) => {
        onChange?.(startTimeEvent.startTime.toISOString());
      }}
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
}

