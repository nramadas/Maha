// import clamp from 'lodash/clamp';
import React, { useCallback, useRef, useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime, concatMap, tap, map } from 'rxjs/operators';
import styled, { css } from 'styled-components/native';

import { Input } from '@/components/controls/Input/index.native';
import { Body1 } from '@/components/typography/Body1/index.native';

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

interface Props<O>
  extends Omit<React.ComponentProps<typeof TextInput>, 'value'> {
  /**
   * Display an icon on the right hand side of the input field
   */
  icon?: React.ReactElement;
  /**
   * Placeholder text to show inside the input
   */
  label: string;
  /**
   * Selected value
   * */
  value: O | null;
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
  const { getItems, value, onSelect, ...rest } = props;
  const [error, setError] = useState<string | undefined>(undefined);
  const [focused, setFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value?.text || '');

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

  const selectItem = useCallback(
    (item: O) => {
      itemsCallback(item.text);
      setLocalValue(item.text);
      onSelect?.(item);
    },
    [itemsCallback, setLocalValue, onSelect],
  );

  const doneEditing = useCallback(
    e => {
      setFocused(false);
      // This component sort of acts like a controlled input. The "value" of
      // the component will be reset to `null` as the user types. If there is
      // typed text that results in a potentially valid choice, and the user
      // has not already made a choice (through selecting an item from the
      // dropdown), then auto select the first item in the list. There is also
      // a race case that this logic solves for. When the user makes a
      // selection from the dropdown, `value` will be defined. However, unless
      // the user types, this value won't reset to `null`. So, the user
      // selection won't be overwritten.
      if (!value && e.nativeEvent.text && items.length) {
        selectItem(items[0]);
      } else if (!value) {
        onSelect?.(null);
      }
      rest.onEndEditing?.(e);
    },
    [items, value, setFocused, selectItem, onSelect],
  );

  React.useEffect(() => {
    itemsCallback('');
  }, [itemsCallback]);

  return (
    <>
      <Input
        {...rest}
        error={error}
        ref={input}
        value={localValue}
        onChangeText={text => {
          setLocalValue(text);
          itemsCallback(text);
          rest.onChangeText?.(text);
          onSelect?.(null);
        }}
        onEndEditing={doneEditing}
        onFocus={e => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
      />
      {!!items.length && focused && (
        <Results>
          {items.map(item => (
            <Pressable
              key={item.text}
              onPress={() => {
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
