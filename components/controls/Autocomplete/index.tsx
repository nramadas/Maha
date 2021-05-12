import cx from 'classnames';
import clamp from 'lodash/clamp';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime, concatMap, tap, map } from 'rxjs/operators';

import { Input } from '@/components/controls/Input';
import { Body2 } from '@/components/typography/Body2';
import { NoopFormProvider } from '@/contexts/Form';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { useTooltip } from '@/hooks/useTooltip';
import { i18n } from '@/lib/translate';
import { PartialPick } from '@/lib/typeHelpers/PartialPick';
import { Text } from '@/models/Text';

import styles from './index.module.scss';

function makeItems<O>(items: O[], text: string, allowInvalidValues?: boolean) {
  return {
    items,
    error:
      !items.length && text && !allowInvalidValues
        ? i18n.translate`No results matching '${{
            name: 'matchText',
            value: text,
          }}'`
        : undefined,
  };
}

interface Option<V, E> {
  text: Text;
  value: V;
  extraData?: E;
}

interface Props<V, E> {
  __doNotWriteToForm?: boolean;
  allowInvalidValues?: boolean;
  /**
   * Add additional styles
   */
  className?: string;
  /**
   * Display an icon on the right hand side of the input field
   */
  icon?: React.ReactElement;
  /**
   * Placeholder text to show inside the input
   */
  label: Text;
  /**
   * Reference name for autocomplete value
   */
  name: string;
  /**
   * Control the autocomplete
   */
  value?: PartialPick<Option<V, E>, 'value' | 'text'>;
  /**
   * Function that returns a list of items to display in the autocomplete.
   * Function can return a `Promise` if needed.
   */
  getItems: (
    inputText?: string | undefined,
  ) => Option<V, E>[] | Promise<Option<V, E>[]>;
  /**
   * Callback that returns what the user is typing
   */
  onChange?: (text: string) => void;
  /**
   * Callback that returns when an item is selected
   */
  onSelect?: (item: Option<V, E> | null) => void;
}

export function Autocomplete<V, E = any>(props: Props<V, E>) {
  const {
    allowInvalidValues,
    className,
    icon,
    label,
    name,
    getItems,
    value,
    onChange,
    onSelect,
  } = props;
  const form = useForm();
  const textToString = useTextToString();
  const writeLock = useRef(false);

  const currentValue: Option<V, E> | undefined = props.__doNotWriteToForm
    ? value
    : form.getValue(name);

  const [localValue, setLocalValue] = useState(
    currentValue ? textToString(currentValue.text) : '',
  );

  useEffect(() => {
    if (!writeLock.current) {
      const text = currentValue ? textToString(currentValue.text) : '';
      setLocalValue(text);
      onChange?.(text);
    }
  }, [currentValue, writeLock]);

  const [Target, Tooltip] = useTooltip({
    alignment: 'full',
    position: 'below',
    type: 'focus',
  });

  const [highlightedItem, setHighlightedItem] = useState<
    Option<V, E> | undefined
  >(undefined);
  const [error, setError] = useState<Text | undefined>(undefined);

  const [itemsCallback, items] = useEventCallback<string, Option<V, E>[]>(
    event =>
      event.pipe(
        debounceTime(150),
        concatMap(inputText => {
          const result = getItems(inputText);
          return result instanceof Promise
            ? result.then(items =>
                makeItems(items, inputText, allowInvalidValues),
              )
            : Promise.resolve(makeItems(result, inputText, allowInvalidValues));
        }),
        tap(results => {
          setHighlightedItem(results.items[0]);
          setError(() => results.error);
        }),
        map(results => results.items),
      ),
    [],
  );

  const selectItem = useCallback(
    (item: Option<V, E>) => {
      const text = textToString(item.text);
      itemsCallback(text);
      setLocalValue(text);
      onChange?.(text);
      onSelect?.(item);

      if (!props.__doNotWriteToForm) {
        form.setValue(name, item);
      }
    },
    [itemsCallback, onChange, onSelect],
  );

  React.useEffect(() => {
    itemsCallback(localValue);
  }, [itemsCallback]);

  return (
    <>
      <NoopFormProvider>
        <Target>
          <Input
            __doNotWriteToForm
            className={cx(className, { [styles.input]: !error })}
            error={error}
            icon={icon}
            label={label}
            name={name}
            value={localValue}
            onBlur={e => {
              // if the input is empty, don't make any selections
              if (e.currentTarget.value && highlightedItem) {
                selectItem(highlightedItem);
              }

              if (
                !allowInvalidValues &&
                (!e.currentTarget.value || !highlightedItem)
              ) {
                if (!props.__doNotWriteToForm) {
                  writeLock.current = true;
                  form.setValue(name, null);
                }

                onSelect?.(null);
              }
            }}
            onInput={e => {
              writeLock.current = false;
              setLocalValue(e.currentTarget.value);
              itemsCallback(e.currentTarget.value);
              onChange?.(e.currentTarget.value);
            }}
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
      </NoopFormProvider>
      {!!items.length && (
        <Tooltip>
          <div
            className={styles.results}
            onMouseLeave={() => setHighlightedItem(undefined)}
          >
            {items.map((item, i) => (
              <div
                className={cx(styles.result, {
                  [styles.focusedResult]: item === highlightedItem,
                })}
                key={textToString(item.text) + i}
                onMouseDown={() => selectItem(item)}
                onMouseEnter={() => setHighlightedItem(item)}
              >
                <Body2>{textToString(item.text)}</Body2>
              </div>
            ))}
          </div>
        </Tooltip>
      )}
    </>
  );
}
