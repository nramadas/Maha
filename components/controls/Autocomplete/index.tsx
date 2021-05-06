import cx from 'classnames';
import clamp from 'lodash/clamp';
import React, { useCallback, useRef, useState } from 'react';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime, concatMap, tap, map } from 'rxjs/operators';

import { Input } from '@/components/controls/Input';
import { Body2 } from '@/components/typography/Body2';
import { NoopFormProvider } from '@/contexts/Form';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { useTooltip } from '@/hooks/useTooltip';
import { i18n } from '@/lib/translate';
import { Text } from '@/models/Text';

import styles from './index.module.scss';

function makeItems<O>(items: O[], text: string) {
  return {
    items,
    error:
      !items.length && text
        ? i18n.translate`No results matching '${{
            name: 'matchText',
            value: text,
          }}'`
        : undefined,
  };
}

interface Option {
  text: Text;
}

interface Props<O> {
  __doNotWriteToForm?: boolean;
  /**
   * Add additional styles
   */
  className?: string;
  /**
   * Initialize the autocomplete with this value
   */
  defaultValue?: O;
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
  const { className, icon, label, name, getItems, onSelect } = props;
  const form = useForm();
  const textToString = useTextToString();
  const defaultValues = useRef(form.getFormValues());
  const defaultValue =
    props.defaultValue || !props.__doNotWriteToForm
      ? defaultValues.current[name]
      : undefined;

  const [Target, Tooltip] = useTooltip({
    alignment: 'full',
    position: 'below',
    type: 'focus',
  });

  const [highlightedItem, setHighlightedItem] = useState<O | undefined>(
    undefined,
  );
  const [error, setError] = useState<Text | undefined>(undefined);

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
      itemsCallback(textToString(item.text));
      onSelect?.(item);
      if (!props.__doNotWriteToForm) {
        form.setValue(name, item);
      }

      if (input.current) {
        input.current.value = textToString(item.text);
      }
    },
    [itemsCallback, onSelect],
  );

  React.useEffect(() => {
    itemsCallback(defaultValue ? textToString(defaultValue) : '');
  }, [itemsCallback]);

  return (
    <>
      <NoopFormProvider>
        <Target>
          <Input
            __doNotWriteToForm
            className={cx(className, { [styles.input]: !error })}
            defaultValue={
              defaultValue ? textToString(defaultValue.text) : undefined
            }
            error={error}
            icon={icon}
            label={label}
            name={name}
            ref={input}
            onBlur={e => {
              // if the input is empty, don't make any selections
              if (e.currentTarget.value && highlightedItem) {
                selectItem(highlightedItem);
              }

              if (!e.currentTarget.value && !props.__doNotWriteToForm) {
                form.setValue(name, null);
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
