import React, { memo } from 'react';

import { applyFilters } from '@/components/explore/applyFilters';
import { applySort } from '@/components/explore/applySort';
import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { PropertyListItem } from '@/components/explore/PropertyListItem';
import {
  useFilters,
  useMapBounds,
  useSortType,
  useSelectedProperty,
} from '@/hooks/useExplorePage';

import styles from './index.module.scss';

interface Props {
  className?: string;
  properties: MapPropertyModel[];
}

export const PropertyList = memo(function PropertyList(props: Props) {
  const { filters } = useFilters();
  const { mapBounds } = useMapBounds();
  const { sortType } = useSortType();
  const { setSelectedProperty } = useSelectedProperty();

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
    </div>
  );
});
