import React from 'react';

import { Marker } from '@/components/maps/Marker';
import { Body2 } from '@/components/typography/Body2';
import { toShortString } from '@/lib/number';
import { Property } from '@/models/Property';

import styles from './index.module.scss';

interface Props {
  property: Pick<
    Property,
    | 'location'
    | 'name'
    | 'numBathrooms'
    | 'numBathroomsHalf'
    | 'numBedrooms'
    | 'price'
  >;
}

export function PropertyMarker(props: Props) {
  const { property } = props;
  const { lat, lng } = property.location;

  if (!(lat && lng)) {
    return null;
  }

  return (
    <Marker point={{ lat, lng }}>
      <div className={styles.container}>
        <div className={styles.text}>
          <Body2>₹{toShortString(property.price)}</Body2>
        </div>
        <div className={styles.pin} />
      </div>
    </Marker>
  );
}
