import React, { useCallback } from 'react';
import { TransitionMotion } from 'react-motion';

import { Input } from '@/components/controls/Input';
import { Calendar as CalendarIcon } from '@/components/icons/Calendar';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useDateSelection, Select } from '@/hooks/useDateSelection';
import { useForm } from '@/hooks/useForm';
import { useTooltip } from '@/hooks/useTooltip';

import { value } from './_common';
import { anim } from './animationHelpers';
import { Calendar } from './Calendar';
import { Header } from './Header';
import styles from './index.module.scss';

interface Props<R extends boolean>
  extends Omit<React.ComponentProps<typeof Input>, 'onSelect'> {
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
   * If true, the Datepicker will allow for a date range to be selected
   */
  range?: R;
  /**
   * In the case of a date range, callback is
   * `(dates: [Date | null, Date | null]) => void`. In the case of a single
   * selection, callback is `(date: Date | null) => void`
   */
  onSelect?: Select<R>;
}

/**
 * Datepicker component. Allows for both single date selection and a dat range
 * selection.
 */
export function Datepicker<R extends boolean>(props: Props<R>) {
  const { minDate, maxDate, name, range, onSelect, ...rest } = props;

  const form = useForm();

  const selectDates = useCallback<Select<R>>(
    // @ts-ignore
    dates => {
      form.setValue(name, dates);
      onSelect?.(dates);
    },
    [form, onSelect],
  );

  // mm/dd/yyyy
  const [format] = useDateFormatter({});

  const [Target, Tooltip] = useTooltip({
    alignment: 'left',
    position: 'below',
    type: 'focus',
  });

  const [currentView, , , rangePosition, setView, select] = useDateSelection(
    range,
    selectDates,
  );

  const selectedDates = form.getValue(name);
  const rangeStart = (range ? (selectedDates || [])[0] : selectedDates) || null;
  const rangeEnd = (range && (selectedDates || [])[1]) || null;

  return (
    <>
      <Target>
        <Input
          {...rest}
          __doNotWriteToForm
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
        value={rangeStart ? rangeStart.getTime() : ''}
      />
      {range && (
        <input
          name={`${name}-end`}
          type="hidden"
          value={rangeEnd ? rangeEnd.getTime() : ''}
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
