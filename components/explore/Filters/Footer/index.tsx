import isNil from 'lodash/isNil';
import React from 'react';

import { Empty } from '@/components/controls/buttons/Empty';
import { useFilters } from '@/hooks/useExplorePage';
import { i18n } from '@/lib/translate';
import { DEFAULT_DATA as DEFAULT_FILTERS } from '@/models/AppliedFilters';

import styles from './index.module.scss';

interface Props {
  className?: string;
}

export function Footer(props: Props) {
  const { filters, setFilters } = useFilters();
  const numFilters = Object.values(filters).filter(v => !isNil(v)).length;

  return (
    <footer className={styles.footer}>
      <Empty disabled={!numFilters} onClick={() => setFilters(DEFAULT_FILTERS)}>
        <i18n.Translate>Reset filters</i18n.Translate>
      </Empty>
    </footer>
  );
}
