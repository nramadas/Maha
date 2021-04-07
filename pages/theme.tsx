import Head from 'next/head';
import React from 'react';

import { createCssVars, CssColorVar } from '@/lib/theme/createCssVars';

type NotCssColor = keyof Omit<ReturnType<typeof createCssVars>, CssColorVar>;

function isColor(key: string): key is CssColorVar {
  return key.startsWith('--color');
}

function isNotColor(key: string): key is NotCssColor {
  return !isColor(key);
}

export default function Theme() {
  const vars = createCssVars();

  const colors = Object.keys(vars).filter(isColor);
  const others = Object.keys(vars).filter(isNotColor);

  return (
    <div>
      <Head>
        <title>Black - Theme</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Colors</h1>
      <div
        style={{
          display: 'grid',
          gridGap: 16,
          gridTemplateColumns: '300px 1fr',
        }}
      >
        {colors.map(color => (
          <React.Fragment key={color}>
            <div>{color}</div>
            <div
              style={{ backgroundColor: vars[color], height: 40, width: 40 }}
              title={vars[color]}
            />
          </React.Fragment>
        ))}
      </div>
      <h1>Other</h1>
      <div
        style={{
          display: 'grid',
          gridGap: 16,
          gridTemplateColumns: '300px 1fr',
        }}
      >
        {others.map(other => (
          <React.Fragment key={other}>
            <div>{other}</div>
            <div>{vars[other]}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
