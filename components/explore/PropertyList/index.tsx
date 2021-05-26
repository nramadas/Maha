import isNil from 'lodash/isNil';
import React, { memo } from 'react';

import { Empty } from '@/components/controls/buttons/Empty';
import { applyFilters } from '@/components/explore/applyFilters';
import { applySort } from '@/components/explore/applySort';
import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { PropertyDetailsList } from '@/components/explore/PropertyDetailsList';
import { PropertyListEmpty } from '@/components/explore/PropertyListEmpty';
import { PropertyListItem } from '@/components/explore/PropertyListItem';
import { Shimmer } from '@/components/loading/Shimmer';
import { H4 } from '@/components/typography/H4';
import { useFilters, useMapBounds, useSortType } from '@/hooks/useExplorePage';
import { i18n } from '@/lib/translate';
import { DEFAULT_DATA as DEFAULT_FILTERS } from '@/models/AppliedFilters';

import styles from './index.module.scss';

function numPlaceholders() {
  if (typeof window === 'undefined') {
    return 0;
  } else {
    return 2 * ((window.innerHeight || 0) / 225);
  }
}

interface Props {
  className?: string;
  pending?: boolean;
  properties: MapPropertyModel[];
}

export const PropertyList = memo(function PropertyList(props: Props) {
  const { filters, setFilters } = useFilters();
  const { applicableMapBounds } = useMapBounds();
  const { sortType } = useSortType();
  const numFilters = Object.values(filters).filter(v => !isNil(v)).length;

  const relevantProperties = props.properties
    .filter(applyFilters(filters))
    .sort(applySort(sortType, applicableMapBounds));

  return (
    <div className={styles.container}>
      {relevantProperties.map(property => (
        <PropertyListItem
          className={styles.property}
          key={property.id}
          property={property}
        />
      ))}
      {!relevantProperties.length && !!numFilters && (
        <div className={styles.noFilters}>
          <H4>
            <i18n.Translate>0 properties</i18n.Translate>
          </H4>
          <Empty
            className={styles.reset}
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            <i18n.Translate>reset filters</i18n.Translate>
          </Empty>
        </div>
      )}
      {props.pending &&
        Array.from({ length: numPlaceholders() }).map((_, i) => (
          <Shimmer className={styles.shimmer} key={i} />
        ))}
      {!!props.properties.length && !props.pending && (
        <PropertyDetailsList propertyIds={props.properties.map(p => p.id)} />
      )}
      {!props.properties.length && !props.pending && <PropertyListEmpty />}
    </div>
  );
});
