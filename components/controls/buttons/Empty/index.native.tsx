import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import styled, { css } from 'styled-components/native';

import { useForm } from '@/hooks/useForm';

interface Props {
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?(): void;
}

interface ExtraProps {
  disabled?: boolean;
  pressed?: boolean;
}

const Container = styled.Pressable`
  align-self: flex-start;
`;

const Button = styled.View<ExtraProps>`
  align-items: center;
  background-color: transparent;
  border-radius: 2px;
  border: 1px solid transparent;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 12px;
`;

const ButtonText = styled.Text<ExtraProps>`
  color: ${props => props.theme.onBackground};
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1.25px;
  line-height: 18px;
  text-decoration: none;
  text-transform: uppercase;

  ${props =>
    props.pressed &&
    css`
      color: ${props => props.theme.primaryPressed};
    `}

  ${props =>
    props.disabled &&
    css`
      color: ${props => props.theme.onDisabled};
    `}
`;

export function Empty(props: Props) {
  const { children, disabled, style, type, onClick } = props;
  const form = useForm();

  return (
    <Container
      style={style}
      onPress={() => {
        if (type === 'submit') {
          form.triggerFormSubmit();
        }
        onClick?.();
      }}
    >
      {({ pressed }) => (
        <Button disabled={disabled} pressed={pressed}>
          <ButtonText disabled={disabled} pressed={pressed}>
            {children}
          </ButtonText>
        </Button>
      )}
    </Container>
  );
}
