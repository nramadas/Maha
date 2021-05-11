import React from 'react';

import { BeginAuthentication } from '@/components/BeginAuthentication';
import { Sparse } from '@/components/chrome/Sparse';

import styles from './index.module.scss';

export default function Login() {
  return (
    <Sparse>
      <div className={styles.content}>
        <BeginAuthentication />
      </div>
    </Sparse>
  );
}
