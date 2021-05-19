import isNil from 'lodash/isNil';
import React, { memo } from 'react';

import { Empty } from '@/components/controls/buttons/Empty';
import { applyFilters } from '@/components/explore/applyFilters';
import { applySort } from '@/components/explore/applySort';
import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { PropertyListItem } from '@/components/explore/PropertyListItem';
import { H4 } from '@/components/typography/H4';
import {
  useFilters,
  useMapBounds,
  useSortType,
  useSelectedProperty,
} from '@/hooks/useExplorePage';
import { i18n } from '@/lib/translate';
import { DEFAULT_DATA as DEFAULT_FILTERS } from '@/models/AppliedFilters';

import styles from './index.module.scss';

interface Props {
  className?: string;
  properties: MapPropertyModel[];
}

export const PropertyList = memo(function PropertyList(props: Props) {
  const { filters, setFilters } = useFilters();
  const { mapBounds } = useMapBounds();
  const { sortType } = useSortType();
  const { setSelectedProperty } = useSelectedProperty();
  const numFilters = Object.values(filters).filter(v => !isNil(v)).length;

  const relevantProperties = props.properties
    .filter(applyFilters(filters))
    .sort(applySort(sortType, mapBounds));

  return (
    <div className={styles.container}>
      {relevantProperties.map(property => (
        <PropertyListItem
          className={styles.property}
          key={property.id}
          property={property}
          onClick={() => setSelectedProperty(property)}
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
    </div>
  );
});
