import React from 'react';
import styled, { css, useTheme } from 'styled-components/native';

import { Checkmark } from '@/components/icons/Checkmark/index.native';
import { Body2 } from '@/components/typography/Body2/index.native';
import { quick as quickAnimation } from '@/lib/animations/native';

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

interface Props {
  label?: string;
  value: boolean;
  onChange(value: boolean): void;
}

export function Checkbox(props: Props) {
  const theme = useTheme();
  const { label, value, onChange } = props;
  quickAnimation();

  return (
    <Container onPress={() => onChange(!value)}>
      {({ pressed }) => (
        <>
          <Press pressed={pressed} />
          <Box>{value && <Checkmark height={24} fill={theme.onPrimary} />}</Box>
          <Label>
            <Body2>{label}</Body2>
          </Label>
        </>
      )}
    </Container>
  );
}
