import React, { memo } from 'react';

import { PropertyDetails } from '@/components/explore/PropertyDetails';

interface Props {
  propertyIds: string[];
}

export const PropertyDetailsList = memo(function PropertyDetailsList(
  props: Props,
) {
  return (
    <>
      {props.propertyIds.map(id => (
        <PropertyDetails key={id} propertyId={id} />
      ))}
    </>
  );
});
