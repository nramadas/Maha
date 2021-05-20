import React, { memo } from 'react';

import { applyFilters } from '@/components/explore/applyFilters';
import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { PropertyMarker } from '@/components/explore/PropertyMarker';
import { useFilters } from '@/hooks/useExplorePage';

interface Props {
  properties: MapPropertyModel[];
}

export const PropertyMarkers = memo(function PropertyMarkers(props: Props) {
  const { filters } = useFilters();

  const filteredProperty = props.properties.filter(applyFilters(filters));

  return (
    <>
      {filteredProperty.map(property => (
        <PropertyMarker key={property.id} property={property} />
      ))}
    </>
  );
});
