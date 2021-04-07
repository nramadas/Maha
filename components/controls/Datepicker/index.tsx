import React from 'react';
import { TransitionMotion } from 'react-motion';

import { Input } from '@/components/controls/Input';
import { Calendar as CalendarIcon } from '@/components/icons/Calendar';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useDateSelection } from '@/hooks/useDateSelection';
import { useTooltip } from '@/hooks/useTooltip';

import { anim } from './animationHelpers';
import { Calendar } from './Calendar';
import { Header } from './Header';
import styles from './index.module.scss';

/**
 * Typeguard for selected dates
 */
function notNull(date: Date | null): date is Date {
  return !!date;
}

/**
 * Helps convert selected dates to human readable dates
 */
function value(
  start: Date | null,
  end: Date | null,
  formatter: (date: Date) => string,
) {
  return [start, end].filter(notNull).map(formatter).join(' - ');
}

interface Props<R extends boolean>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSelect'> {
  /**
   * Placeholder text to show inside the input
   */
  label: string;
  /**
   * The latest date the calendar will allow the user to select. If not
   * provided, it defaults to 50 years after the current date.
   */
  maxDate?: Date;
  /**
   * The earliest date the calendar will allow the user to select. If not
   * provided, defaults to the current date.
   */
  minDate?: Date;
  /**
   * Reference name for datepicker value
   */
  name: string;
  /**
   * If true, the Datepicker will allow for a date range to be selected
   */
  range?: R;
  /**
   * In the case of a date range, callback is
   * `(dates: [Date | null, Date | null]) => void`. In the case of a single
   * selection, callback is `(date: Date | null) => void`
   */
  onSelect?: R extends true
    ? (dates: [Date | null, Date | null]) => void
    : (date: Date | null) => void;
}

/**
 * Datepicker component. Allows for both single date selection and a dat range
 * selection.
 */
export function Datepicker<R extends boolean>(props: Props<R>) {
  const { minDate, maxDate, name, range, onSelect, ...rest } = props;

  // mm/dd/yyyy
  const [format] = useDateFormatter({});

  const [Target, Tooltip] = useTooltip({
    alignment: 'left',
    position: 'below',
    type: 'focus',
  });

  const [
    currentView,
    rangeStart,
    rangeEnd,
    rangePosition,
    setView,
    select,
  ] = useDateSelection(range, onSelect);

  return (
    <>
      <Target>
        <Input
          {...rest}
          readOnly
          data-ignore="true"
          icon={<CalendarIcon />}
          name={`${name}-ignore`}
          value={value(rangeStart, rangeEnd, format)}
        />
      </Target>
      <input
        name={range ? `${name}-start` : name}
        type="hidden"
        value={rangeStart ? rangeStart.getTime() : undefined}
      />
      {range && (
        <input
          name={`${name}-end`}
          type="hidden"
          value={rangeEnd ? rangeEnd.getTime() : undefined}
        />
      )}
      <Tooltip>
        <div className={styles.container}>
          <Header
            max={maxDate}
            min={minDate}
            view={currentView}
            onChange={setView}
          />
          <TransitionMotion
            defaultStyles={anim.default(currentView)}
            styles={anim.styles(currentView)}
            willEnter={anim.willEnter()}
            willLeave={anim.willLeave(currentView)}
          >
            {interpolatedItems => (
              <div className={styles.calendarContainer}>
                {interpolatedItems.map(item => (
                  <div
                    className={styles.calendar}
                    key={item.key}
                    style={anim.css(item)}
                  >
                    <Calendar
                      end={rangeEnd}
                      minDate={minDate}
                      position={rangePosition}
                      range={props.range}
                      start={rangeStart}
                      view={item.data.date}
                      onSelect={select}
                    />
                  </div>
                ))}
              </div>
            )}
          </TransitionMotion>
        </div>
      </Tooltip>
    </>
  );
}
