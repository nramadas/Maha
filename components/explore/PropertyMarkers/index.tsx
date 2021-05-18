import React, { memo } from 'react';

import { applyFilters } from '@/components/explore/applyFilters';
import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { PropertyMarker } from '@/components/explore/PropertyMarker';
import { useAppliedFilters, useSelectedProperty } from '@/hooks/useExplorePage';

interface Props {
  properties: MapPropertyModel[];
}

export const PropertyMarkers = memo(function PropertyMarkers(props: Props) {
  const { appliedFilters } = useAppliedFilters();
  const { setSelectedProperty } = useSelectedProperty<MapPropertyModel>();

  const filteredProperty = props.properties.filter(
    applyFilters(appliedFilters),
  );

  return (
    <>
      {filteredProperty.map(property => (
        <PropertyMarker
          key={property.id}
          property={property}
          onClick={() => setSelectedProperty(property)}
        />
      ))}
    </>
  );
});
