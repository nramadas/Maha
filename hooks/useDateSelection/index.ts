import { useCallback, useState } from 'react';

import { today } from '@/lib/date';

export enum Range {
  Start,
  End,
}

type RangeSelect = (dates: [Date | null, Date | null]) => void;
type SingleSelect = (date: Date | null) => void;
export type Select<R extends boolean> = R extends true
  ? RangeSelect
  : SingleSelect;
type Return = [
  Date,
  Date | null,
  Date | null,
  Range,
  (date: Date) => void,
  (date: Date) => void,
];

interface RangeState {
  end: Date | null;
  rangePosition: Range;
  start: Date | null;
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

export function useRangeSelection<R extends boolean>(
  range?: R,
  onSelect?: Select<R>,
) {
  const [state, setState] = useState<RangeState>({
    rangePosition: Range.Start,
    end: null,
    start: null,
  });

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
        rangePosition,
        start,
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

  return [state, select] as const;
}

export function useDateSelection<R extends boolean>(
  range?: R,
  onSelect?: Select<R>,
): Return {
  const [view, setView] = useState<Date>(today());
  const [rangeSelection, select] = useRangeSelection(range, onSelect);

  return [
    view,
    rangeSelection.start,
    rangeSelection.end,
    rangeSelection.rangePosition,
    setView,
    select,
  ];
}
