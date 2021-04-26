import isEqual from 'lodash/isEqual';
import React from 'react';
import styled, { css, useTheme } from 'styled-components/native';

import { Checkmark } from '@/components/icons/Checkmark/index.native';
import { Body2 } from '@/components/typography/Body2/index.native';
import { useForm } from '@/hooks/useForm';
import { quick as quickAnimation } from '@/lib/animations/native';

interface Value {
  text: string;
}

interface ExtraProps {
  checked?: boolean;
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

const Box = styled.View`
  background-color: transparent;
  border-radius: 2px;
  border: 2px solid ${props => props.theme.primary};
  height: 28px;
  left: 16px;
  margin-top: -14px;
  position: absolute;
  top: 50%;
  width: 28px;
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

interface Props<V> {
  disabled?: boolean;
  label?: string;
  name: string;
  value: V;
  onSelect?(value: V): void;
}

export function Checkbox<V extends Value>(props: Props<V>) {
  const form = useForm();
  const theme = useTheme();
  const { disabled, label, name, value, onSelect } = props;
  const currentSelections: V[] = form.getValue(name) || [];
  const isSelected = !!currentSelections.find(s => isEqual(s, value));

  quickAnimation();

  return (
    <Container
      onPress={() => {
        const newSelections = isSelected
          ? currentSelections.filter(s => !isEqual(s, value))
          : currentSelections.concat(value);

        form.setValue(name, newSelections);
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
            <Body2>{label}</Body2>
          </Label>
        </>
      )}
    </Container>
  );
}
