import cx from 'classnames';
import React, { useRef, useState } from 'react';

import { Caption } from '@/components/typography';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { Range, reselectingStart } from '@/hooks/useDateSelection';
import { today } from '@/lib/date';

import { equal, createDates, inRange, Props } from './_common';
import styles from './index.module.scss';

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
