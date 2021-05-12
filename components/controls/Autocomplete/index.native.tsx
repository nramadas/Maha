import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime, concatMap, tap, map } from 'rxjs/operators';
import styled, { css } from 'styled-components/native';

import { Input } from '@/components/controls/Input/index.native';
import { Body1 } from '@/components/typography/Body1/index.native';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { i18n } from '@/lib/translate';
import { PartialPick } from '@/lib/typeHelpers/PartialPick';
import { Text } from '@/models/Text';

function makeItems<O>(items: O[], text: string) {
  return {
    items,
    error:
      text && !items.length
        ? i18n.translate`No results matching '${{
            name: 'matchText',
            value: text,
          }}'`
        : undefined,
  };
}

const Results = styled.View`
  background-color: ${props => props.theme.field};
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  border: 1px solid ${props => props.theme.fieldFocused};
  margin-top: -1px;
`;

const Result = styled.View<{ pressed: boolean }>`
  padding: 6px 8px;

  ${props =>
    props.pressed &&
    css`
      background-color: ${props.theme.primaryHovered};
    `}
`;

interface Option<V, E> {
  text: Text;
  value: V;
  extraData?: E;
}

interface Props<V, E> {
  __doNotWriteToForm?: boolean;
  allowInvalidValues?: boolean;
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
   * Function can return a `Promise` if needed. `
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
    getItems,
    label,
    name,
    onChange,
    onSelect,
  } = props;
  const form = useForm();
  const textToString = useTextToString();
  const [error, setError] = useState<Text | undefined>(undefined);
  const [focused, setFocused] = useState(false);

  const currentValue: Option<V, E> | undefined = form.getValue(name);

  const [localValue, setLocalValue] = useState(
    currentValue ? textToString(currentValue.text) : '',
  );

  useEffect(() => {
    const text = currentValue ? textToString(currentValue.text) : '';
    setLocalValue(text);
    onChange?.(text);
  }, [currentValue, setLocalValue]);

  const [itemsCallback, items] = useEventCallback<string, Option<V, E>[]>(
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
          setError(() => results.error);
        }),
        map(results => results.items),
      ),
    [],
  );

  const input = useRef<TextInput>(null);
  const selectionLock = useRef(false);

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
    [itemsCallback, setLocalValue, onChange, onSelect],
  );

  const doneEditing = useCallback(
    e => {
      setFocused(false);
      if (!selectionLock.current && e.nativeEvent.text && items.length) {
        selectItem(items[0]);
      } else if (!selectionLock.current && !allowInvalidValues) {
        form.setValue(name, null);
        onSelect?.(null);
      }

      selectionLock.current = false;
    },
    [items, setFocused, selectItem, onSelect],
  );

  React.useEffect(() => {
    itemsCallback(localValue);
  }, [itemsCallback]);

  return (
    <>
      <Input
        __doNotWriteToForm
        error={error}
        label={label}
        name={name}
        ref={input}
        value={localValue}
        onChangeText={text => {
          setLocalValue(text);
          itemsCallback(text);
          onChange?.(text);
          onSelect?.(null);
        }}
        onEndEditing={doneEditing}
        onFocus={() => {
          setFocused(true);
        }}
      />
      {!!items.length && focused && (
        <Results>
          {items.map(item => (
            <Pressable
              key={textToString(item.text)}
              onPress={() => {
                selectionLock.current = true;
                selectItem(item);
                input.current?.blur();
              }}
            >
              {({ pressed }) => (
                <Result pressed={pressed}>
                  <Body1>{item.text}</Body1>
                </Result>
              )}
            </Pressable>
          ))}
        </Results>
      )}
    </>
  );
}
