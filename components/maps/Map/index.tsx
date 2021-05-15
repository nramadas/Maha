import MarkerClusterer from '@googlemaps/markerclustererplus';
import React, { useRef, useState } from 'react';

import { GoogleMapContext } from '@/contexts/GoogleMap';
import { useGoogleMapsSDK } from '@/hooks/useGoogleMapsSDK';
import { MapPoint } from '@/models/MapPoint';

import styles from './index.module.scss';

interface Props {
  center?: MapPoint;
  children?: React.ReactNode;
  className?: string;
}

export function Map(props: Props) {
  const prevContainerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useGoogleMapsSDK(
    sdk => {
      if (
        containerRef.current &&
        containerRef.current !== prevContainerRef.current
      ) {
        const map = new sdk.Map(containerRef.current, {
          center: props.center ? new sdk.LatLng(props.center) : undefined,
          clickableIcons: false,
          disableDefaultUI: true,
          draggableCursor: 'grab',
          draggingCursor: 'grabbing',
          zoom: 11,
        });

        prevContainerRef.current = containerRef.current;
        clustererRef.current = new MarkerClusterer(map, [], {
          gridSize: 40,
          zIndex: 9,
          styles: [
            {
              className: styles.cluster,
              height: 30,
              width: 30,
              textColor: 'var(--color-background)',
            },
          ],
        });

        setMap(map);
      }
    },
    [containerRef.current],
  );

  return (
    <div className={styles.container} ref={containerRef}>
      <GoogleMapContext.Provider
        value={{ clusterer: clustererRef.current, map }}
      >
        {props.children}
      </GoogleMapContext.Provider>
    </div>
  );
}
