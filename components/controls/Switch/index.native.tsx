import React, { useEffect } from 'react';
import styled, { css } from 'styled-components/native';

import { useForm } from '@/hooks/useForm';
import { quick as quickAnimation } from '@/lib/animations/native';

interface Props {
  /**
   * Starting value for the switch. One of `'on'` or `'off'`.
   */
  defaultValue?: boolean;
  /**
   * When set to true, prevents the users for toggling the Switch
   */
  disabled?: boolean;
  /**
   * Input name
   */
  name: string;
  /**
   * Callback, fired when the value changes. Signature is
   * `(value: boolean) => void`
   */
  onChange?: (value: boolean) => void;
}

const SIZE = 36;

const Bg = styled.View<{ disabled?: boolean; selected?: boolean }>`
  background-color: ${props => props.theme.primaryFaded};
  border-radius: ${SIZE}px;
  bottom: 0;
  left: 0;
  position: absolute;
  right: ${SIZE}px;
  top: 0;

  ${props =>
    props.selected &&
    css`
      right: 0;
    `}

  ${props =>
    props.disabled &&
    css`
      background-color: ${props => props.theme.disabled};
    `}
`;

const Container = styled.View<{ disabled?: boolean }>`
  background-color: ${props => props.theme.field};
  border-radius: ${SIZE}px;
  border: 1px solid ${props => props.theme.fieldFocused};
  height: ${SIZE / 2}px;
  position: relative;
  width: ${SIZE * 1.5}px;

  ${props =>
    props.disabled &&
    css`
      background-color: ${props => props.theme.disabled};
    `}
`;

const Thumb = styled.View<{
  disabled?: boolean;
  pressed?: boolean;
  selected?: boolean;
}>`
  background-color: ${props => props.theme.background};
  border-radius: ${SIZE}px;
  border: 1px solid ${props => props.theme.primaryFaded};
  height: ${SIZE - 2}px;
  left: -1px;
  position: absolute;
  top: ${-SIZE / 4 + 1}px;
  width: ${SIZE - 2}px;

  ${props =>
    props.selected &&
    css`
      background-color: ${props => props.theme.primary};
      border-color: ${props => props.theme.primary};
      left: ${SIZE * 0.75 - 3}px;
    `}

  ${props =>
    props.pressed &&
    css`
      background-color: ${props => props.theme.primaryFaded};
    `}

  ${props =>
    props.disabled &&
    css`
      background-color: ${props => props.theme.disabled};
      border-color: ${props => props.theme.onDisabled};
    `}
`;

const Wrapper = styled.Pressable`
  height: ${SIZE}px;
`;

/**
 * Switch, behaves like a checkbox
 */
export function Switch(props: Props) {
  const { disabled, defaultValue, name, onChange } = props;
  const form = useForm();

  useEffect(() => {
    if (defaultValue) {
      form.setValue(name, defaultValue);
    }
  }, []);

  quickAnimation();

  const selected = form.getValue(name) || defaultValue;

  return (
    <Wrapper onPress={() => onChange?.(!selected)}>
      {({ pressed }) => (
        <Container disabled={disabled}>
          <Bg disabled={disabled} selected={!!selected} />
          <Thumb disabled={disabled} pressed={pressed} selected={!!selected} />
        </Container>
      )}
    </Wrapper>
  );
}
