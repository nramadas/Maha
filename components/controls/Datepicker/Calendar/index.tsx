import cx from 'classnames';
import React, { useRef, useState } from 'react';

import { Caption } from '@/components/typography';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { Range, reselectingStart } from '@/hooks/useDateSelection';
import { firstOfTheMonth, patch, today, toParts } from '@/lib/date';

import styles from './index.module.scss';

/**
 * Helper to determine if two dates are more or less equal. For the purposes of
 * a calendar, it's not important if two dates are exactly the same. Instead,
 * what's relevant is if two dates occur or the same day.
 */
function equal(date1: Date, date2: Date | null) {
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
const createDates = (() => {
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
function inRange(date: Date, start: Date | null, end: Date | null) {
  if (!(start && end)) {
    return false;
  }

  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

interface Props<R extends boolean> {
  end: Date | null;
  minDate?: Date;
  position: Range;
  start: Date | null;
  view: Date;
  range?: R;
  onSelect(date: Date): void;
}

export function Calendar<R extends boolean>(props: Props<R>) {
  const [formatHeader] = useDateFormatter({ weekday: 'narrow' });
  const [formatDay] = useDateFormatter({ day: 'numeric' });
  const [hovered, setHovered] = useState<Date | null>(null);

  // use a ref so that the calendar does not need to be recomputed everytime
  // props change
  const dates = useRef(createDates(props.view));
  const min = props.minDate || today();

  return (
    <div>
      <div className={styles.grid}>
        {dates.current.slice(0, 7).map(date => (
          <div
            className={cx(styles.cell, styles.header)}
            key={'h' + date.getTime()}
          >
            <Caption>{formatHeader(date)}</Caption>
          </div>
        ))}
        {dates.current.map(date => (
          <div
            className={cx(styles.cell, styles.date, {
              [styles.cellDisabled]:
                date.getMonth() !== props.view.getMonth() ||
                (date.getFullYear() <= min.getFullYear() &&
                  date.getMonth() <= min.getMonth() &&
                  date.getDate() < min.getDate()),
            })}
            key={date.getTime()}
            onMouseDown={e => {
              // in the case where the user needs to make another selection,
              // preventDefault on the event so that tooltip that contains the
              // datepicker doesn't close.
              if (
                props.range &&
                (props.position === Range.Start ||
                  reselectingStart(props.start, props.end, date))
              ) {
                e.preventDefault();
              }

              props.onSelect(date);
            }}
            onMouseEnter={() => setHovered(date)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className={cx({
                [styles.cellHovered]: equal(date, hovered),
                [styles.cellInRange]:
                  props.range &&
                  inRange(date, props.start, props.end || hovered),
                [styles.cellInRangeEnd]: equal(date, props.end || hovered),
                [styles.cellInRangeStart]: equal(date, props.start),
              })}
            >
              <div
                className={cx(styles.cellInner, {
                  [styles.selected]:
                    equal(date, props.start) || equal(date, props.end),
                })}
              >
                <Caption>{formatDay(date)}</Caption>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
