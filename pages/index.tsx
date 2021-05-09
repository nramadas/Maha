import React from 'react';

import { General } from '@/components/chrome/General';
import { Hero } from '@/components/Hero';
import { Cities } from '@/components/home/Cities';
import { NoAgents } from '@/components/home/NoAgents';
import { Tagline } from '@/components/home/Tagline';

import styles from './index.module.scss';

export default function Index() {
  return (
    <General transparentHeader>
      <Hero className={styles.hero}>
        <Tagline />
      </Hero>
      <Cities className={styles.cities} />
      <NoAgents className={styles.agents} />
    </General>
  );
}
