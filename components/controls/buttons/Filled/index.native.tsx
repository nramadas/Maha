import React, { ReactNode } from 'react';
import { Pressable } from 'react-native';
import styled, { css } from 'styled-components/native';

interface Props
  extends Omit<React.ComponentProps<typeof Pressable>, 'children' | 'onPress'> {
  children?: ReactNode;
  disabled?: boolean;
  onPress?(): void;
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
  background-color: ${props => props.theme.primary};
  border-radius: 2px;
  border: 1px solid ${props => props.theme.primary};
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 12px 18px;

  ${props =>
    props.disabled &&
    css`
      background-color: ${props => props.theme.disabled};
      border-color: ${props => props.theme.disabled};
    `}

  ${props =>
    props.pressed &&
    css`
      background-color: ${props => props.theme.primaryPressed};
      border-color: ${props => props.theme.primaryPressed};
    `}
`;

const ButtonText = styled.Text<ExtraProps>`
  color: ${props => props.theme.onPrimary};
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1.25px;
  line-height: 18px;
  text-decoration: none;
  text-transform: uppercase;

  ${props =>
    props.disabled &&
    css`
      color: ${props => props.theme.onDisabled};
    `}
`;

export function Filled(props: Props) {
  const { children, disabled, onPress, ...rest } = props;

  return (
    <Container {...rest} onPress={onPress}>
      {({ pressed }) => (
        <Button disabled={props.disabled} pressed={pressed}>
          <ButtonText disabled={props.disabled} pressed={pressed}>
            {props.children}
          </ButtonText>
        </Button>
      )}
    </Container>
  );
}
