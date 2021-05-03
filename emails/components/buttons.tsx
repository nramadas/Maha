import React from 'react';
import { useTheme } from 'styled-components';

interface Props {
  children?: React.ReactNode;
  href: string;
}

export function Filled(props: Props) {
  const theme = useTheme();

  return (
    <a
      href={props.href}
      style={{
        backgroundColor: theme.primary,
        borderRadius: '2px',
        color: theme.onPrimary,
        fontSize: '0.875rem',
        fontWeight: 500,
        letterSpacing: '1.25px',
        lineHeight: 1,
        outline: 'none',
        padding: '6px 12px 6px',
        textDecoration: 'none',
        textTransform: 'uppercase',
      }}
    >
      {props.children}
    </a>
  );
}
