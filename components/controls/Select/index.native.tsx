import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import styled, { css, useTheme } from 'styled-components/native';

import { ChevronDown } from '@/components/icons/ChevronDown/index.native';
import { Body1 } from '@/components/typography';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

import { sortOptions } from './sortOptions';

interface Option {
  text: Text;
}

interface Props<O> {
  children: (option: O & { text: string }) => JSX.Element;
  defaultSelected?: O;
  name: string;
  options: O[];
  placeholder?: Text;
  onChange?(option: O): void;
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

export function Select<O extends Option>(props: Props<O>) {
  const form = useForm();
  const textToString = useTextToString();
  const [selected, setSelected] = useState<O | null>(
    props.defaultSelected || (props.placeholder ? null : props.options[0]),
  );
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    form.setValue(props.name, selected);
  }, [selected]);

  const sortedOptions = sortOptions(props.options, textToString, selected);
  const showPlaceholder = !selected && props.placeholder;

  const render = (option: O) =>
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
            <Icon fill={theme.primary} height={32} isOpen={isOpen} width={32} />
          </SelectOption>
        )}
      </Pressable>
      {isOpen &&
        (showPlaceholder ? sortedOptions.slice() : sortedOptions.slice(1)).map(
          o => (
            <Pressable
              key={textToString(o.text)}
              onPress={() => {
                setSelected(o);
                props.onChange?.(o);
                setIsOpen(false);
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
