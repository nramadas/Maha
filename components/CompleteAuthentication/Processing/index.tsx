import React from 'react';

import { LoadingDots } from '@/components/LoadingDots';
import { Body1 } from '@/components/typography/Body1';

import styles from './index.module.scss';

export function Processing() {
  return (
    <div className={styles.container}>
      <div>
        <Body1>Logging you in</Body1>
        <LoadingDots interval={250} />
      </div>
    </div>
  );
}
