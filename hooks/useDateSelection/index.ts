import { useCallback, useState } from 'react';

import { today } from '@/lib/date';

export enum Range {
  Start,
  End,
}

type RangeSelect = (dates: [Date | null, Date | null]) => void;
type SingleSelect = (date: Date | null) => void;
type Select<R extends boolean> = R extends true ? RangeSelect : SingleSelect;
type Return = [
  Date,
  Date | null,
  Date | null,
  Range,
  (date: Date) => void,
  (date: Date) => void,
];

interface State {
  end: Date | null;
  rangePosition: Range;
  start: Date | null;
  view: Date;
}

export function reselectingStart(
  start: Date | null,
  end: Date | null,
  date: Date,
) {
  if (start && end) {
    return true;
  }

  return start ? date.getTime() < start.getTime() : true;
}

export function useDateSelection<R extends boolean>(
  range?: R,
  onSelect?: Select<R>,
): Return {
  const [state, setState] = useState<State>({
    end: null,
    rangePosition: Range.Start,
    start: null,
    view: today(),
  });

  const setView = useCallback(
    (date: Date) => {
      setState({
        end: state.end,
        start: state.start,
        rangePosition: state.rangePosition,
        view: date,
      });
    },
    [state],
  );

  const select = useCallback(
    (date: Date) => {
      let end = state.end;
      let start = state.start;
      let rangePosition = state.rangePosition;

      // single selection
      if (!range) {
        start = date;
        end = null;
        rangePosition = Range.Start;
      }
      // if both dates are selected, or if the date selected is before the
      // first date, restart selection
      else if (reselectingStart(start, end, date)) {
        start = date;
        end = null;
        rangePosition = Range.End;
      }
      // currently selecting start
      else if (state.rangePosition === Range.Start) {
        start = date;
        end = null;
        rangePosition = Range.End;
      }
      // currently selecting end
      else if (state.rangePosition === Range.End) {
        end = date;
        rangePosition = Range.Start;
      }

      setState({
        end,
        start,
        rangePosition,
        view: state.view,
      });

      if (onSelect) {
        if (range) {
          (onSelect as RangeSelect)([start, end]);
        } else {
          (onSelect as SingleSelect)(start);
        }
      }
    },
    [onSelect, range, state],
  );

  return [
    state.view,
    state.start,
    state.end,
    state.rangePosition,
    setView,
    select,
  ];
}
