import cx from 'classnames';
import isNil from 'lodash/isNil';
import React, { memo } from 'react';

import { Close } from '@/components/icons/Close';
import { Caption } from '@/components/typography/Caption';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { useFilters } from '@/hooks/useExplorePage';
import { i18n } from '@/lib/translate';
import { DEFAULT_DATA as DEFAULT_FILTERS } from '@/models/AppliedFilters';

import styles from './index.module.scss';

interface Props {
  className?: string;
}

export const FilterButton = memo(function FilterButton(props: Props) {
  const { filters, setFilters } = useFilters();
  const [open] = useBottomSheet('filters');
  const numFilters = Object.values(filters).filter(v => !isNil(v)).length;

  return (
    <div
      className={cx(styles.container, props.className)}
      onClick={() => open()}
    >
      <Caption>
        <i18n.Translate>Filters:</i18n.Translate>
      </Caption>
      {numFilters ? (
        <Caption className={styles.count}>
          <i18n.Translate>
            <i18n.Param name="numFilters" count={numFilters}>
              {numFilters}
            </i18n.Param>{' '}
            filters
          </i18n.Translate>
        </Caption>
      ) : (
        <Caption className={styles.add}>
          <i18n.Translate>Add</i18n.Translate>
        </Caption>
      )}
      {!!numFilters && (
        <Close
          className={styles.remove}
          onClick={e => {
            e.stopPropagation();
            setFilters(DEFAULT_FILTERS);
          }}
        />
      )}
    </div>
  );
});
