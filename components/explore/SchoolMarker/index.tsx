import React, { memo } from 'react';

import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { Book } from '@/components/icons/Book';
import { Marker } from '@/components/maps/Marker';

import styles from './index.module.scss';

type School = MapPropertyModel['schools'][number];

interface Props {
  school: School;
}

export const SchoolMarker = memo(function SchoolMarker(props: Props) {
  const { school } = props;
  const { lat, lng } = school.location;

  if (!(lat && lng)) {
    return null;
  }

  return (
    <Marker excludeFromCluster point={{ lat, lng }}>
      <div className={styles.container}>
        <Book className={styles.icon} />
        <div className={styles.pin} />
      </div>
    </Marker>
  );
});
