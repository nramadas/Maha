import MarkerClusterer from '@googlemaps/markerclustererplus';
import React, { useEffect, useRef, useState } from 'react';

import { GoogleMapContext } from '@/contexts/GoogleMap';
import { useGoogleMapsSDK } from '@/hooks/useGoogleMapsSDK';
import { MapPoint } from '@/models/MapPoint';

import styles from './index.module.scss';

function calculateEdgeHighlights(
  map?: google.maps.Map | null,
  hoverPoint?: MapPoint,
) {
  if (map && hoverPoint) {
    const lat = hoverPoint?.lat;
    const lng = hoverPoint?.lng;

    const bounds = map?.getBounds();
    const ne = bounds?.getNorthEast();
    const sw = bounds?.getSouthWest();

    if (lat && lng && ne && sw) {
      return {
        isEast: lng > ne.lng(),
        isNorth: lat > ne.lat(),
        isSouth: lat < sw.lat(),
        isWest: lng < sw.lng(),
      };
    }
  }

  return {
    isEast: false,
    isNorth: false,
    isSouth: false,
    isWest: false,
  };
}

type EdgeHighlights = ReturnType<typeof calculateEdgeHighlights>;

interface Bounds {
  ne?: MapPoint;
  sw?: MapPoint;
}

interface Props {
  children?: React.ReactNode;
  className?: string;
  focusPoint?: MapPoint;
  hoverPoint?: MapPoint;
  initialCenter?: MapPoint;
  onBoundsChange?(bounds: Bounds): void;
}

export function Map(props: Props) {
  const prevContainerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [edgeHighlights, setEdgeHighlights] = useState<EdgeHighlights>(
    calculateEdgeHighlights(),
  );

  useGoogleMapsSDK(
    sdk => {
      if (
        containerRef.current &&
        containerRef.current !== prevContainerRef.current &&
        props.initialCenter
      ) {
        const map = new sdk.Map(containerRef.current, {
          center: props.initialCenter
            ? new sdk.LatLng(props.initialCenter)
            : undefined,
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
          styles: [28, 32, 36, 40, 44, 48, 52].map(size => ({
            className: styles.cluster,
            height: size,
            width: size,
            textColor: 'var(--color-background)',
          })),
        });

        setMap(map);

        const boundsListener = map.addListener('bounds_changed', () => {
          if (props.onBoundsChange) {
            const rawBounds = map.getBounds();
            const ne = rawBounds?.getNorthEast();
            const sw = rawBounds?.getSouthWest();

            props.onBoundsChange({
              ne: ne
                ? {
                    lat: ne.lat(),
                    lng: ne.lng(),
                  }
                : undefined,
              sw: sw
                ? {
                    lat: sw.lat(),
                    lng: sw.lng(),
                  }
                : undefined,
            });
          }
        });

        return () => sdk.event.removeListener(boundsListener);
      }
    },
    [containerRef.current, props.initialCenter?.lat, props.initialCenter?.lng],
  );

  useEffect(() => {
    if (map && props.focusPoint?.lat && props.focusPoint?.lng) {
      map.panTo({ lat: props.focusPoint.lat, lng: props.focusPoint.lng });

      // setting the zoom when it is already at the correct zoom level
      // causes the pan animation to not work
      if (map.getZoom() !== 13) {
        map.setZoom(13);
      }
    }
  }, [map, props.focusPoint?.lat, props.focusPoint?.lng]);

  useEffect(() => {
    setEdgeHighlights(calculateEdgeHighlights(map, props.hoverPoint));

    const listener = map?.addListener('bounds_changed', () => {
      setEdgeHighlights(calculateEdgeHighlights(map, props.hoverPoint));
    });

    return () => listener && google.maps.event.removeListener(listener);
  }, [map, props.hoverPoint?.lat, props.hoverPoint?.lng]);

  return (
    <div className={styles.container} ref={containerRef}>
      <GoogleMapContext.Provider
        value={{ clusterer: clustererRef.current, map }}
      >
        {props.children}
      </GoogleMapContext.Provider>
      {edgeHighlights.isEast && <div className={styles.highlightEast} />}
      {edgeHighlights.isNorth && <div className={styles.highlightNorth} />}
      {edgeHighlights.isSouth && <div className={styles.highlightSouth} />}
      {edgeHighlights.isWest && <div className={styles.highlightWest} />}
    </div>
  );
}
