import { Range } from '@/hooks/useDateSelection';
import { firstOfTheMonth, patch, toParts } from '@/lib/date';

/**
 * Helper to determine if two dates are more or less equal. For the purposes of
 * a calendar, it's not important if two dates are exactly the same. Instead,
 * what's relevant is if two dates occur or the same day.
 */
export function equal(date1: Date, date2: Date | null) {
  if (!date2) {
    return false;
  }

  const _date1 = toParts(date1);
  const _date2 = toParts(date2);
  return (
    _date1.day === _date2.day &&
    _date1.month === _date2.month &&
    _date1.year === _date2.year
  );
}

/**
 * Given a reference date (like today's date), generates all the dates to fill
 * out a calendar. Stores computer calendars in a Map to memoize the result.
 */
export const createDates = (() => {
  const map = new Map<Date, Date[]>();

  return (referenceDate: Date) => {
    if (map.has(referenceDate)) {
      return map.get(referenceDate) as Date[];
    }

    let current = firstOfTheMonth(referenceDate);
    const dayOfWeek = new Date(current).getDay();

    // we want our dates to start on a sunday
    current = patch(current, { day: -dayOfWeek });
    const dates: Date[] = [];

    while (dates.length < 42) {
      dates.push(current);
      current = patch(current, { day: 1 });
    }

    map.set(referenceDate, dates);

    return dates;
  };
})();

/**
 * Determines if a date lands between a start and end date.
 */
export function inRange(date: Date, start: Date | null, end: Date | null) {
  if (!(start && end)) {
    return false;
  }

  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

export interface Props<R extends boolean> {
  end: Date | null;
  minDate?: Date;
  position: Range;
  start: Date | null;
  view: Date;
  range?: R;
  onSelect(date: Date): void;
}
