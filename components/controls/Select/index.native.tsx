import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import styled, { css, useTheme } from 'styled-components/native';

import { ChevronDown } from '@/components/icons/ChevronDown/index.native';
import { Close } from '@/components/icons/Close';
import { Body1 } from '@/components/typography';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

import { sortOptions } from './sortOptions';

interface Option<V, E> {
  disabled?: boolean;
  text: Text;
  value: V;
  extraData?: E;
}

interface Props<V, E> {
  children: (option: Option<V, E> & { text: string }) => JSX.Element;
  name: string;
  options: Option<V, E>[];
  placeholder?: Text;
  onChange?(option: Option<V, E> | null): void;
}

const Container = styled.View<{ open?: boolean }>`
  background-color: ${props => props.theme.background};
  border-radius: 2px;
  border: 1px solid transparent;

  ${props =>
    props.open &&
    css`
      border-color: ${props => props.theme.primaryFocused};
    `}
`;

const Icon = styled(ChevronDown)<{ isOpen?: boolean }>`
  margin-left: 8px;

  ${props =>
    props.isOpen &&
    css`
      transform: rotate(180deg);
    `}
`;

const CloseIcon = styled(Close)`
  margin-left: 8px;
`;

const SelectOption = styled.View<{ notFirst?: boolean; pressed?: boolean }>`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 60px;
  padding: 0 12px;

  ${props =>
    props.notFirst &&
    css`
      border-top-width: 1px;
      border-top-color: ${props => props.theme.fieldFocused};
    `}

  ${props =>
    props.pressed &&
    css`
      background-color: ${props => props.theme.field};
    `}
`;

const Placeholder = styled(Body1)`
  color: ${props => props.theme.primary};
`;

export function Select<V, E = any>(props: Props<V, E>) {
  const form = useForm();
  const textToString = useTextToString();
  const preSort = sortOptions(props.options, textToString, null);
  const selected =
    form.getValue(props.name) || (props.placeholder ? null : preSort[0]);

  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const sortedOptions = sortOptions(props.options, textToString, selected);
  const showPlaceholder = !selected && props.placeholder;

  const render = (option: Option<V, E>) =>
    props.children({ ...option, text: textToString(option.text) });

  return (
    <Container open={isOpen}>
      <Pressable onPress={() => setIsOpen(!isOpen)}>
        {({ pressed }) => (
          <SelectOption pressed={pressed}>
            <View>
              {selected ? (
                render(selected)
              ) : props.placeholder ? (
                <Placeholder>{textToString(props.placeholder)}</Placeholder>
              ) : (
                render(sortedOptions[0])
              )}
            </View>
            {selected ? (
              <Pressable
                onPress={() => {
                  form.setValue(props.name, null);
                  props.onChange?.(null);
                }}
              >
                <CloseIcon />
              </Pressable>
            ) : (
              <Icon
                fill={theme.primary}
                height={32}
                isOpen={isOpen}
                width={32}
              />
            )}
          </SelectOption>
        )}
      </Pressable>
      {isOpen &&
        (showPlaceholder ? sortedOptions.slice() : sortedOptions.slice(1)).map(
          o => (
            <Pressable
              key={textToString(o.text)}
              onPress={() => {
                if (!o.disabled) {
                  form.setValue(props.name, o);
                  props.onChange?.(o);
                  setIsOpen(false);
                }
              }}
            >
              {({ pressed }) => (
                <SelectOption notFirst pressed={pressed}>
                  {render(o)}
                </SelectOption>
              )}
            </Pressable>
          ),
        )}
    </Container>
  );
}
