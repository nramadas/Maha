import cx from 'classnames';
import clamp from 'lodash/clamp';
import React, { useCallback, useRef, useState } from 'react';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime, concatMap, tap, map } from 'rxjs/operators';

import { Input } from '@/components/controls/Input';
import { Body2 } from '@/components/typography/Body2';
import { useTooltip } from '@/hooks/useTooltip';

import styles from './index.module.scss';

function makeItems<O>(items: O[], text: string) {
  return {
    items,
    error: text && !items.length ? `No results matching '${text}'` : undefined,
  };
}

interface Option {
  text: string;
}

interface Props<O>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSelect'> {
  /**
   * Display an icon on the right hand side of the input field
   */
  icon?: React.ReactElement;
  /**
   * Placeholder text to show inside the input
   */
  label: string;
  /**
   * Reference name for autocomplete value
   */
  name: string;
  /**
   * Function that returns a list of items to display in the autocomplete.
   * Function can return a `Promise` if needed. Signature:
   * `<O extends {text: string}>(inputText?: string | undefined) => O[] | Promise<O[]>`
   */
  getItems: (inputText?: string | undefined) => O[] | Promise<O[]>;
  /**
   * Callback that returns when an item is selected
   */
  onSelect?: (item: O) => void;
}

export function Autocomplete<O extends Option>(props: Props<O>) {
  const { className, getItems, onSelect, ...rest } = props;
  const [Target, Tooltip] = useTooltip({
    alignment: 'full',
    position: 'below',
    type: 'focus',
  });

  const [highlightedItem, setHighlightedItem] = useState<O | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | undefined>(undefined);

  const [itemsCallback, items] = useEventCallback<string, O[]>(
    event =>
      event.pipe(
        debounceTime(150),
        concatMap(inputText => {
          const result = getItems(inputText);
          return result instanceof Promise
            ? result.then(items => makeItems(items, inputText))
            : Promise.resolve(makeItems(result, inputText));
        }),
        tap(results => {
          setHighlightedItem(results.items[0]);
          setError(results.error);
        }),
        map(results => results.items),
      ),
    [],
  );

  const input = useRef<HTMLInputElement>(null);

  const selectItem = useCallback(
    (item: O) => {
      itemsCallback(item.text);
      onSelect && onSelect(item);

      if (input.current) {
        input.current.value = item.text;
      }
    },
    [itemsCallback, onSelect],
  );

  React.useEffect(() => {
    itemsCallback('');
  }, [itemsCallback]);

  return (
    <>
      <Target>
        <Input
          {...rest}
          className={cx(className, { [styles.input]: !error })}
          error={error}
          ref={input}
          onBlur={e => {
            // if the input is empty, don't make any selections
            if (e.currentTarget.value && highlightedItem) {
              selectItem(highlightedItem);
            }
          }}
          onInput={e => itemsCallback(e.currentTarget.value)}
          onKeyDown={e => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              // the prevent default is require to keep the cursor from moving
              e.preventDefault();
              const length = items.length;
              let selectedIndex = 0;

              // if we already have something highlighted, find the next item
              // to highlight based on key that was pressed
              if (highlightedItem) {
                const modifier = e.key === 'ArrowDown' ? 1 : -1;

                for (let i = 0; i < items.length; i++) {
                  if (items[i] === highlightedItem) {
                    selectedIndex = clamp(i + modifier, 0, length - 1);
                  }
                }
              }
              // nothing was previously highlighted, so pick either the first
              // or last item in the list
              else if (e.key === 'ArrowUp') {
                selectedIndex = length - 1;
              }

              setHighlightedItem(items[selectedIndex]);
            }

            if (e.key === 'Enter') {
              if (highlightedItem) {
                selectItem(highlightedItem);
              }

              e.currentTarget.blur();
            }
          }}
        />
      </Target>
      {!!items.length && (
        <Tooltip>
          <div
            className={styles.results}
            onMouseLeave={() => setHighlightedItem(undefined)}
          >
            {items.map(item => (
              <div
                className={cx(styles.result, {
                  [styles.focusedResult]: item === highlightedItem,
                })}
                key={item.text}
                onMouseDown={() => selectItem(item)}
                onMouseEnter={() => setHighlightedItem(item)}
              >
                <Body2>{item.text}</Body2>
              </div>
            ))}
          </div>
        </Tooltip>
      )}
    </>
  );
}
