import isEqual from 'lodash/isEqual';
import React from 'react';
import styled, { css } from 'styled-components/native';

import { Body2 } from '@/components/typography/Body2';
import { useForm } from '@/hooks/useForm';

interface ChoiceObj {
  disabled?: boolean;
  text: string;
}

interface Props<C> {
  /**
   * A list of choices to select from
   */
  choices: C[];
  /**
   * Reference name for chips value
   */
  name: string;
  /**
   * Callback that returns when an item is selected
   */
  onChoose?: (choice: C) => void;
}

const Container = styled.View`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: -8px;
  margin-left: -8px;
`;

const PillContainer = styled.Pressable`
  margin-bottom: 8px;
  margin-left: 8px;
  position: relative;
`;

const Pill = styled.View<{
  disabled?: boolean;
  pressed?: boolean;
  selected?: boolean;
}>`
  align-items: center;
  background-color: ${props => props.theme.field};
  border-radius: 24px;
  border: 1px solid ${props => props.theme.fieldFocused};
  display: flex;
  flex-direction: row;
  height: 24px;
  justify-content: center;
  padding: 0 16px;

  ${props =>
    props.pressed &&
    css`
      background-color: ${props => props.theme.fieldFocused};
    `}

  ${props =>
    props.selected &&
    css`
      background-color: ${props => props.theme.primary};
    `}

  ${props =>
    props.disabled &&
    css`
      background-color: ${props => props.theme.disabled};
    `}
`;

const PillText = styled(Body2)<{ disabled?: boolean; selected?: boolean }>`
  ${props =>
    props.disabled &&
    css`
      color: ${props => props.theme.onDisabled};
    `};
`;

export function Choice<C extends ChoiceObj>(props: Props<C>) {
  const form = useForm();
  const { name, choices, onChoose } = props;
  const selected = form.getValue(name);

  return (
    <Container>
      {choices.map(choice => (
        <PillContainer
          key={choice.text}
          onPress={() => {
            if (choice.disabled) {
              return;
            }
            form.setValue(name, choice);
            onChoose?.(choice);
          }}
        >
          {({ pressed }) => (
            <Pill
              disabled={choice.disabled}
              pressed={!choice.disabled && pressed}
              selected={isEqual(selected, choice)}
            >
              <PillText disabled={choice.disabled}>{choice.text}</PillText>
            </Pill>
          )}
        </PillContainer>
      ))}
    </Container>
  );
}
