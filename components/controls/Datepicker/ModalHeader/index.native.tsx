import React from 'react';
import styled from 'styled-components/native';

import { Empty } from '@/components/controls/buttons/Empty/index.native';
import { H4 } from '@/components/typography/H4/index.native';

const Row = styled.View`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
`;

const Close = styled(Empty)`
  margin-top: -20px;
  position: absolute;
  right: 0;
  top: 50%;
`;

interface Props {
  done?: boolean;
  title: string;
  onClose(): void;
}

export function ModalHeader(props: Props) {
  return (
    <Row>
      <H4>{props.title}</H4>
      <Close onPress={props.onClose}>{props.done ? 'Done' : 'Cancel'}</Close>
    </Row>
  );
}
