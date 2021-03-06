import cx from 'classnames';
import clamp from 'lodash/clamp';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime, concatMap, tap, map } from 'rxjs/operators';

import { Close } from '@/components/icons/Close';
import { Body2 } from '@/components/typography/Body2';
import { Caption } from '@/components/typography/Caption';
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

interface Choice<V, E> {
  text: Text;
  value: V;
  extraData?: E;
}

interface Props<V, E> extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Placeholder text to show inside the input
   */
  label: Text;
  /**
   * Reference name for chips value
   */
  name: string;
  /**
   * Function that returns a list of items to display in the autocomplete.
   * Function can return a `Promise` if needed. Signature:
   * `<O extends {text: string}>(inputText?: string | undefined) => O[] | Promise<O[]>`
   */
  getChoices: (
    inputText?: string | undefined,
    currentlySelected?: Choice<V, E>[],
  ) => Choice<V, E>[] | Promise<Choice<V, E>[]>;
  /**
   * Callback that returns when an item is selected
   */
  onChoose?: (choices: Choice<V, E>[]) => void;
}

/**
 * Chips component that behaves like an autocomplete, but allows for multiple
 * selections.
 */
export function Input<V, E = any>(props: Props<V, E>) {
  const { getChoices, label, name, onChoose, ...rest } = props;

  const form = useForm();
  const textToString = useTextToString();

  const currentSelections: Choice<V, E>[] = form.getValue(name) || [];

  const [localValue, setLocalValue] = useState('');

  const [Target, Tooltip] = useTooltip({
    alignment: 'full',
    position: 'below',
    type: 'focus',
  });

  const [highlightedItem, setHighlightedItem] = useState<
    Choice<V, E> | undefined
  >(undefined);

  const [error, setError] = useState<Text | undefined>(undefined);
  const [focused, setFocused] = useState(false);
  const getSelected = useRef(() => currentSelections);

  useEffect(() => {
    getSelected.current = () => currentSelections;
  }, [currentSelections]);

  const [itemsCallback, items] = useEventCallback<string, Choice<V, E>[]>(
    event =>
      event.pipe(
        debounceTime(150),
        concatMap(inputText => {
          const currentlySelected = getSelected.current();
          const result = getChoices(inputText, currentlySelected);
          return result instanceof Promise
            ? result.then(items => makeItems(items, inputText))
            : Promise.resolve(makeItems(result, inputText));
        }),
        tap(results => {
          setHighlightedItem(results.items[0]);
          setError(() => results.error);
        }),
        map(results => results.items),
      ),
    [],
  );

  const selectChoice = useCallback(
    (item: Choice<V, E>) => {
      itemsCallback('');
      const newSelected = [...currentSelections];
      const alreadyContains = !isNil(
        newSelected.find(s => isEqual(s.value, item.value)),
      );

      if (!alreadyContains) {
        newSelected.push(item);
      }

      setLocalValue('');
      form.setValue(name, newSelected);
      onChoose && onChoose(newSelected);
    },
    [currentSelections, itemsCallback, onChoose],
  );

  const deleteChoice = useCallback(
    (item: Choice<V, E>) => {
      itemsCallback && itemsCallback('');
      const newSelected = currentSelections.filter(
        s => !isEqual(s.value, item.value),
      );
      form.setValue(name, newSelected);
      onChoose && onChoose(newSelected);
    },
    [currentSelections, itemsCallback, onChoose],
  );

  useEffect(() => {
    itemsCallback(localValue);
  }, [itemsCallback]);

  return (
    <>
      <Target>
        <div>
          <label
            className={cx(styles.inputContainer, {
              [styles.withError]: !!error,
              [styles.inputContainerFocused]: focused,
              [styles.inputContainerNotEmpty]: !!currentSelections.length,
            })}
          >
            {currentSelections.map(choice => (
              <div
                className={styles.choiceContainer}
                key={textToString(choice.text)}
              >
                <input
                  checked
                  readOnly
                  className={styles.hidden}
                  onKeyDown={e => {
                    if (e.key === 'Backspace') {
                      e.preventDefault();
                      deleteChoice(choice);
                    }
                  }}
                  name={name}
                  type="checkbox"
                  value={textToString(choice.text)}
                />
                <div
                  className={styles.choice}
                  onClick={() => deleteChoice(choice)}
                >
                  <div className={styles.deleteCircle}>
                    <Close className={styles.delete} />
                  </div>
                  <Caption>{textToString(choice.text)}</Caption>
                </div>
              </div>
            ))}
            <input
              {...rest}
              className={styles.input}
              placeholder="&nbsp;"
              type="text"
              value={localValue}
              onBlur={e => {
                // if the input is empty, don't make any selections
                if (e.currentTarget.value && highlightedItem) {
                  selectChoice(highlightedItem);
                }

                setFocused(false);
              }}
              onFocus={() => {
                setFocused(true);
              }}
              onInput={e => {
                setLocalValue(e.currentTarget.value);
                itemsCallback && itemsCallback(e.currentTarget.value);
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

                if (e.key === 'Escape') {
                  e.currentTarget.blur();
                }

                if (e.key === 'Enter') {
                  if (highlightedItem) {
                    selectChoice(highlightedItem);
                  }
                }

                if (
                  e.key === 'Backspace' &&
                  currentSelections.length &&
                  !e.currentTarget.value
                ) {
                  deleteChoice(currentSelections[currentSelections.length - 1]);
                }
              }}
            />
            <div className={styles.label}>{textToString(label)}</div>
          </label>
          {error && (
            <div className={styles.error}>
              <Caption>{textToString(error)}</Caption>
            </div>
          )}
        </div>
      </Target>
      {!!items.length && focused && (
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
                key={textToString(item.text)}
                onMouseDown={() => selectChoice(item)}
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
