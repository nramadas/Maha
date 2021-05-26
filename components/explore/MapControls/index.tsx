import React, { memo } from 'react';

import { Filled } from '@/components/controls/buttons/Filled';
import { useMapBounds } from '@/hooks/useExplorePage';
import { i18n } from '@/lib/translate';
import { MapBounds } from '@/models/MapBounds';
import { MapPoint } from '@/models/MapPoint';

import styles from './index.module.scss';

const DRIFT_THRESHOLD = 0.02;

function latDrift(a: MapPoint, b: MapPoint) {
  return Math.abs(a.lat - b.lat);
}

function lngDrift(a: MapPoint, b: MapPoint) {
  return Math.abs(a.lng - b.lng);
}

function boundsHaveDrifted(bounds1: MapBounds, bounds2: MapBounds) {
  if (bounds1.ne && bounds2.ne && bounds1.sw && bounds2.sw) {
    if (
      latDrift(bounds1.ne, bounds2.ne) > DRIFT_THRESHOLD ||
      latDrift(bounds1.sw, bounds2.sw) > DRIFT_THRESHOLD ||
      lngDrift(bounds1.ne, bounds2.ne) > DRIFT_THRESHOLD ||
      lngDrift(bounds1.ne, bounds2.ne) > DRIFT_THRESHOLD
    ) {
      return true;
    }
  }

  return false;
}

export const MapControls = memo(function MapControls() {
  const {
    applicableMapBounds,
    mapBounds,
    syncApplicableMapBounds,
  } = useMapBounds();

  const showButton = boundsHaveDrifted(applicableMapBounds, mapBounds);

  return (
    <>
      {showButton && (
        <Filled
          className={styles.syncMapBounds}
          onClick={syncApplicableMapBounds}
        >
          <i18n.Translate>redo sort in map</i18n.Translate>
        </Filled>
      )}
    </>
  );
});
