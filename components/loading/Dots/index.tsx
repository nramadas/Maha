import React, { useState } from 'react';

import { Body1 } from '@/components/typography/Body1';
import { useInterval } from '@/hooks/useInterval';

interface Props {
  interval: number;
}

export function Dots(props: Props) {
  const { interval } = props;
  const [numDotsVisible, setNumDotsVisible] = useState(0);

  useInterval(interval, () => {
    if (numDotsVisible === 3) {
      setNumDotsVisible(0);
    } else {
      setNumDotsVisible(numDotsVisible + 1);
    }
  });

  return (
    <>
      <Body1 style={{ opacity: numDotsVisible >= 1 ? 1 : 0 }}>.</Body1>
      <Body1 style={{ opacity: numDotsVisible >= 2 ? 1 : 0 }}>.</Body1>
      <Body1 style={{ opacity: numDotsVisible === 3 ? 1 : 0 }}>.</Body1>
    </>
  );
}

Dots.defaultProps = {
  interval: 1000,
};
