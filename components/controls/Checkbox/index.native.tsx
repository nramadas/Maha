import isEqual from 'lodash/isEqual';
import React from 'react';
import styled, { css, useTheme } from 'styled-components/native';

import { Checkmark } from '@/components/icons/Checkmark/index.native';
import { Body2 } from '@/components/typography/Body2/index.native';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { quick as quickAnimation } from '@/lib/animations/native';
import { Text } from '@/models/Text';

interface ExtraProps {
  checked?: boolean;
  disabled?: boolean;
  pressed?: boolean;
}

const Container = styled.Pressable`
  align-items: center;
  align-self: flex-start;
  display: flex;
  flex-direction: row;
  height: 60px;
  min-width: 60px;
  overflow: hidden;
  position: relative;
`;

const Box = styled.View<ExtraProps>`
  background-color: transparent;
  border-radius: 2px;
  border: 2px solid ${props => props.theme.primary};
  height: 28px;
  left: 16px;
  margin-top: -14px;
  position: absolute;
  top: 50%;
  width: 28px;

  ${props =>
    props.disabled &&
    css`
      background-color: ${props.theme.disabled};
    `}
`;

const Label = styled.View`
  line-height: 40px;
  margin-bottom: 3px;
  padding-left: 60px;
  position: relative;
`;

const Press = styled.View<ExtraProps>`
  background-color: transparent;
  border-radius: 30px;
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
  width: 60px;

  ${props =>
    props.pressed &&
    css`
      background-color: ${props.theme.fieldHovered};
    `}
`;

const LabelText = styled(Body2)<ExtraProps>`
  ${props =>
    props.pressed &&
    css`
      color: ${props.theme.disabled};
    `}
`;

interface Value<V, E> {
  value: V;
  extraData?: E;
}

interface Props<V, E> {
  __doNotWriteToForm?: boolean;
  disabled?: boolean;
  label?: Text;
  name: string;
  value: Value<V, E>;
  onSelect?(value: Value<V, E>): void;
}

export function Checkbox<V, E = any>(props: Props<V, E>) {
  const { disabled, label, name, value, onSelect } = props;

  const form = useForm();
  const textToString = useTextToString();
  const theme = useTheme();

  const currentSelections: Value<V, E>[] = form.getValue(name) || [];
  const isSelected = !!currentSelections.find(s =>
    isEqual(s.value, value.value),
  );

  quickAnimation();

  return (
    <Container
      onPress={() => {
        if (disabled) {
          return;
        }

        const withoutSelected = currentSelections.filter(
          s => !isEqual(s.value, value.value),
        );
        const newSelections = isSelected
          ? withoutSelected
          : withoutSelected.concat(value);

        if (!props.__doNotWriteToForm) {
          form.setValue(name, newSelections);
        }

        onSelect?.(value);
      }}
    >
      {({ pressed }) => (
        <>
          <Press pressed={pressed} />
          <Box>
            {isSelected && <Checkmark height={24} fill={theme.onPrimary} />}
          </Box>
          <Label>
            <LabelText>{label && textToString(label)}</LabelText>
          </Label>
        </>
      )}
    </Container>
  );
}
