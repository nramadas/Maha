import React, { forwardRef } from 'react';
import { TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import styled, { css } from 'styled-components/native';

import { Caption } from '@/components/typography/Caption';
import { quick as quickAnimation } from '@/lib/animations/native';

export interface Props extends React.ComponentProps<typeof TextInput> {
  disabled?: boolean;
  error?: string;
  label: string;
}

interface ExtraProps {
  disabled?: boolean;
  error?: string;
  focused?: boolean;
  hasText?: boolean;
}

const Container = styled.View`
  height: 52px;
  position: relative;
`;

const Error = styled(Caption)`
  color: ${props => props.theme.error};
`;

const Label = styled.View<ExtraProps>`
  left: 9px;
  margin-top: -5px;
  position: absolute;
  top: 50%;

  ${props =>
    props.hasText &&
    css`
      margin-top: 0;
      top: 8px;
    `}
`;

const LabelText = styled.Text<ExtraProps>`
  color: ${props => props.theme.onBackground};
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 1.5px;
  line-height: 14px;
  text-transform: uppercase;

  ${props =>
    props.disabled &&
    css`
      color: ${props => props.theme.disabled};
    `}

  ${props =>
    props.error &&
    css`
      color: ${props => props.theme.error};
    `}

  ${props =>
    (props.focused || props.hasText) &&
    css`
      color: ${props => props.theme.primary};
    `}

  ${props =>
    props.hasText &&
    css`
      font-size: 10px;
    `}
`;

const RawInput = styled.TextInput<ExtraProps>`
  background-color: ${props => props.theme.field};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.fieldBorder};
  color: ${props => props.theme.onBackground};
  font-size: 16px;
  font-weight: 400;
  height: 100%;
  padding: 0 8px;
  width: 100%;

  ${props =>
    props.disabled &&
    css`
      color: ${props => props.theme.disabled};
    `}

  ${props =>
    props.error &&
    css`
      background-color: ${props => props.theme.fieldError};
      border-color: ${props => props.theme.error};
    `}

  ${props =>
    props.hasText &&
    css`
      padding: 18px 8px 6px;
    `}
`;

export const Input = forwardRef<TextInput, Props>((props, ref) => {
  const { disabled, error, label, style, ...rest } = props;
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={style}
    >
      <Container>
        <RawInput
          {...rest}
          disabled={disabled}
          error={error}
          hasText={!!rest.value}
          ref={ref}
          secureTextEntry={rest.secureTextEntry}
          onBlur={e => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          onChangeText={text => {
            quickAnimation();
            rest.onChangeText?.(text);
          }}
          onFocus={e => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
        />
        <Label hasText={!!rest.value}>
          <LabelText
            disabled={disabled}
            error={error}
            focused={isFocused}
            hasText={!!rest.value}
          >
            {label}
          </LabelText>
        </Label>
      </Container>
      {!!error && <Error>{error}</Error>}
    </KeyboardAvoidingView>
  );
});
