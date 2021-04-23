import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

import { useLanguagePack } from '@/hooks/useLanguagePack';

import { Props as BaseProps, getPhrases } from './element';

const Container = styled.View`
  align-items: center;
  align-self: flex-start;
  display: flex;
  flex-direction: row;
`;

interface Props extends BaseProps {
  TextComponent?: React.ComponentType;
}

export function Translate(props: Props) {
  const languagePack = useLanguagePack();
  const phrases = getPhrases(languagePack, props);
  const TextComponent = props.TextComponent || Text;

  return (
    <Container>
      {phrases.map(p =>
        typeof p === 'string' ? <TextComponent>{p}</TextComponent> : p,
      )}
    </Container>
  );
}
