import React, { useCallback, useRef, useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime, concatMap, tap, map } from 'rxjs/operators';
import styled, { css } from 'styled-components/native';

import { Input } from '@/components/controls/Input/index.native';
import { Body1 } from '@/components/typography/Body1/index.native';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

function makeItems<O>(items: O[], text: string) {
  return {
    items,
    error: text && !items.length ? `No results matching '${text}'` : undefined,
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

interface Option {
  text: string;
}

interface Props<O> {
  __doNotWriteToForm?: boolean;
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
  onSelect?: (item: O | null) => void;
}

export function Autocomplete<O extends Option>(props: Props<O>) {
  const { getItems, label, name, onSelect } = props;
  const [error, setError] = useState<string | undefined>(undefined);
  const [focused, setFocused] = useState(false);
  const form = useForm();
  const textToString = useTextToString();
  const defaultValues = useRef(form.getFormValues());
  const defaultValue =
    props.defaultValue || !props.__doNotWriteToForm
      ? defaultValues.current[name]
      : undefined;

  const [localValue, setLocalValue] = useState(
    defaultValue ? textToString(defaultValue) : '',
  );

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
          setError(results.error);
        }),
        map(results => results.items),
      ),
    [],
  );

  const input = useRef<TextInput>(null);
  const selectionLock = useRef(false);

  const selectItem = useCallback(
    (item: O) => {
      itemsCallback(item.text);
      setLocalValue(item.text);
      if (!props.__doNotWriteToForm) {
        form.setValue(name, item);
      }
      onSelect?.(item);
    },
    [itemsCallback, setLocalValue, onSelect],
  );

  const doneEditing = useCallback(
    e => {
      setFocused(false);
      if (!selectionLock.current && e.nativeEvent.text && items.length) {
        selectItem(items[0]);
      } else if (!selectionLock.current) {
        form.setValue(name, null);
        onSelect?.(null);
      }

      selectionLock.current = false;
    },
    [items, setFocused, selectItem, onSelect],
  );

  React.useEffect(() => {
    itemsCallback(defaultValue ? textToString(defaultValue) : '');
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
              key={item.text}
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
