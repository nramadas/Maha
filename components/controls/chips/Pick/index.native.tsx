import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import React from 'react';
import styled, { css, useTheme } from 'styled-components/native';

import { Checkmark } from '@/components/icons/Checkmark/index.native';
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
  onChoose?: (choices: C[]) => void;
}

const Container = styled.View`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: -8px;
  margin-left: -8px;
`;

const CheckCircle = styled.View<{ pressed?: boolean; selected?: boolean }>`
  align-items: center;
  background-color: ${props => props.theme.background};
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  height: 16px;
  justify-content: center;
  margin-right: 8px;
  width: 16px;
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
  padding: 0 16px 0 4px;

  ${props =>
    props.selected &&
    css`
      background-color: ${props => props.theme.primary};
    `}

  ${props =>
    props.pressed &&
    css`
      background-color: ${props => props.theme.fieldFocused};
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

export function Pick<C extends ChoiceObj>(props: Props<C>) {
  const form = useForm();
  const theme = useTheme();
  const { choices, name, onChoose } = props;
  const selected: C[] = form.getValue(name) || [];

  return (
    <Container>
      {choices.map(choice => {
        const isSelected = !isNil(selected.find(s => isEqual(s, choice)));

        return (
          <PillContainer
            key={choice.text}
            onPress={() => {
              if (choice.disabled) {
                return;
              }

              const withoutChoice = selected.filter(s => !isEqual(s, choice));
              const newSelected =
                withoutChoice.length === selected.length
                  ? withoutChoice.concat(choice)
                  : withoutChoice;
              form.setValue(name, newSelected);
              onChoose?.(newSelected);
            }}
          >
            {({ pressed }) => (
              <Pill
                disabled={choice.disabled}
                pressed={!choice.disabled && pressed}
                selected={isSelected}
              >
                <CheckCircle pressed={pressed} selected={isSelected}>
                  {isSelected && (
                    <Checkmark fill={theme.onBackground} height={8} width={8} />
                  )}
                </CheckCircle>
                <PillText disabled={choice.disabled}>{choice.text}</PillText>
              </Pill>
            )}
          </PillContainer>
        );
      })}
    </Container>
  );
}
