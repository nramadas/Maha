import React from 'react';

import { Dots } from '@/components/loading/Dots';
import { Body1 } from '@/components/typography/Body1';

import styles from './index.module.scss';

export function Processing() {
  return (
    <div className={styles.container}>
      <div>
        <Body1>Logging you in</Body1>
        <Dots interval={250} />
      </div>
    </div>
  );
}
