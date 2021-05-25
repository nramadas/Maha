import React, { memo } from 'react';

import { H3 } from '@/components/typography/H3';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

export const PropertyListEmpty = memo(function PropertyListEmpty() {
  return (
    <article className={styles.container}>
      <H3>
        <i18n.Translate>No properties in this location</i18n.Translate>
      </H3>
    </article>
  );
});
