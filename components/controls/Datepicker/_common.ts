import { PeriodMarkingProps } from 'react-native-calendars';

import {
  before,
  firstOfTheMonth,
  patch,
  monthIsBefore,
  today,
  toParts,
} from '@/lib/date';
import { createColors } from '@/lib/theme/createColors';

type Theme = ReturnType<typeof createColors>;

const _pad = (n: number) => String(n).padStart(2, '0');

/**
 * Returns a string to use with react-native-calendars
 */
export function calendarDateString(date: Date) {
  const { day, month, year } = toParts(date);
  return `${year}-${_pad(month + 1)}-${_pad(day)}`;
}

/**
 * Typeguard for selected dates
 */
export function notNull(date: Date | null): date is Date {
  return !!date;
}

/**
 * Helps convert selected dates to human readable dates
 */
export function value(
  start: Date | null,
  end: Date | null,
  formatter: (date: Date) => string,
) {
  return [start, end].filter(notNull).map(formatter).join(' - ');
}

/**
 * Returns all the dates in the months between the start and end dates. Useful
 * for creating calendar views for multiple months in a row.
 */
export function allCalendarMonths(start?: Date | null, end?: Date | null) {
  const now = today();
  const min = firstOfTheMonth(start || now);
  const max = end || patch(min, { year: 3 });

  const dates: Date[] = [];
  const endDate = patch(max, { month: 1 });
  let currentDate = min;
  while (monthIsBefore(currentDate, endDate)) {
    dates.push(currentDate);
    currentDate = patch(currentDate, { month: 1 });
  }

  return dates;
}

export function markDays(
  theme: Theme,
  range?: boolean,
  start?: Date | null,
  end?: Date | null,
) {
  const markedDates: PeriodMarkingProps['markedDates'] = {};

  if (start) {
    markedDates[calendarDateString(start)] = {
      color: theme.primaryFaded,
      textColor: theme.onBackground,
      selected: true,
      startingDay: true,
      endingDay: !range,
    };
  }

  if (end) {
    markedDates[calendarDateString(end)] = {
      color: theme.primaryFaded,
      textColor: theme.onBackground,
      selected: true,
      endingDay: true,
    };
  }

  if (start && end) {
    let cur = patch(start, { day: 1 });
    while (before(cur, end)) {
      markedDates[calendarDateString(cur)] = {
        color: theme.primaryFaded,
        textColor: theme.onBackground,
      };

      cur = patch(cur, { day: 1 });
    }
  }

  return markedDates;
}
