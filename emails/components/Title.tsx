import React from 'react';
import { useTheme } from 'styled-components';

interface Props {
  children?: React.ReactNode;
}

export function Title(props: Props) {
  const theme = useTheme();

  return <h2 style={{ color: theme.primary }}>{props.children}</h2>;
}
