import React from 'react';
import { useTheme } from 'styled-components';

interface Props {
  children?: React.ReactNode;
}

export function Container(props: Props) {
  const theme = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.field,
        borderRadius: 8,
        fontFamily: theme.font,
        margin: '0 auto',
        maxWidth: 400,
        padding: 12,
        textAlign: 'center',
      }}
    >
      {props.children}
    </div>
  );
}
