import isEqual from 'lodash/isEqual';
import React from 'react';
import styled, { css } from 'styled-components/native';

import { Body2 } from '@/components/typography/Body2/index.native';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { quick as quickAnimation } from '@/lib/animations/native';
import { Text } from '@/models/Text';

interface Value<V, E> {
  value: V;
  extraData?: E;
}

interface Props<V, E> {
  disabled?: boolean;
  label?: Text;
  name: string;
  value: Value<V, E>;
  onSelect?(value: Value<V, E>): void;
}

const Circle = styled.View<{ disabled?: boolean }>`
  background-color: transparent;
  border-radius: 15px;
  border: 2px solid ${props => props.theme.primary};
  height: 30px;
  left: 15px;
  margin-top: -15px;
  position: absolute;
  top: 50%;
  width: 30px;

  ${props =>
    props.disabled &&
    css`
      background-color: ${props => props.theme.disabled};
    `}
`;

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

const Dot = styled.View<{ disabled?: boolean }>`
  background-color: ${props => props.theme.primary};
  border-radius: 10px;
  height: 20px;
  left: 20px;
  margin-top: -10px;
  position: absolute;
  top: 50%;
  width: 20px;

  ${props =>
    props.disabled &&
    css`
      background-color: ${props => props.theme.disabled};
    `}
`;

const Label = styled.View`
  padding-left: 60px;
`;

const Press = styled.View<{ pressed?: boolean }>`
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

/**
 * Custom radio button
 */
export function Radio<V, E>(props: Props<V, E>) {
  const { disabled, label, name, value, onSelect } = props;
  const form = useForm();
  const textToString = useTextToString();

  quickAnimation();

  const currentlySelected = form.getValue(name);
  const selected = isEqual(currentlySelected?.value, value.value);

  return (
    <Container
      onPress={() => {
        form.setValue(name, value);
        onSelect?.(value);
      }}
    >
      {({ pressed }) => (
        <>
          <Press pressed={pressed} />
          <Circle disabled={disabled} />
          {selected && <Dot disabled={disabled} />}
          {label && (
            <Label>
              <Body2>{textToString(label)}</Body2>
            </Label>
          )}
        </>
      )}
    </Container>
  );
}
