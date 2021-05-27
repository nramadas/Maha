import MarkerClusterer from '@googlemaps/markerclustererplus';
import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { GoogleMapContext } from '@/contexts/GoogleMap';
import {
  useHighlightedLandmark,
  useHoveredProperty,
  useMapBounds,
  useSelectedProperty,
} from '@/hooks/useExplorePage';
import { useGoogleMapsSDK } from '@/hooks/useGoogleMapsSDK';
import { locationToMapPoint } from '@/lib/map';
import { MapPoint } from '@/models/MapPoint';

import styles from './index.module.scss';

function calculateEdgeHighlights(
  map?: google.maps.Map | null,
  hoverPoint?: MapPoint | null,
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

function renderDirections(
  map: google.maps.Map,
  line: google.maps.Polyline,
  directions: google.maps.DirectionsResult | null,
) {
  if (directions) {
    const route = directions.routes[0];
    const points = route.overview_path;
    line.setPath(points);
    line.setMap(map);
    map.panToBounds(route.bounds);
  } else {
    line.setMap(null);
  }
}

const cachedDirections = new globalThis.Map<
  string,
  google.maps.DirectionsResult
>();

type EdgeHighlights = ReturnType<typeof calculateEdgeHighlights>;
type School = MapPropertyModel['schools'][number];

interface Props {
  children?: React.ReactNode;
  className?: string;
  initialCenter?: MapPoint;
}

export function Map(props: Props) {
  const prevContainerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [edgeHighlights, setEdgeHighlights] = useState<EdgeHighlights>(
    calculateEdgeHighlights(),
  );
  const sdkRef = useRef<typeof google.maps | null>(null);
  const directionsRendererRef = useRef<google.maps.Polyline | null>(null);

  const { hoveredProperty } = useHoveredProperty<MapPropertyModel>();
  const { setMapBounds } = useMapBounds();
  const { selectedProperty } = useSelectedProperty<MapPropertyModel>();
  const { highlightedLandmark } = useHighlightedLandmark<School>();

  const hoverPoint = hoveredProperty
    ? locationToMapPoint(hoveredProperty.location)
    : null;

  const focusPoint = selectedProperty
    ? locationToMapPoint(selectedProperty.location)
    : null;

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
        sdkRef.current = sdk;
        directionsRendererRef.current = new sdk.Polyline({
          clickable: false,
          strokeColor: '#7E57C2',
        });
        return () => directionsRendererRef.current?.unbindAll();
      }
    },
    [containerRef.current, props.initialCenter?.lat, props.initialCenter?.lng],
  );

  useEffect(() => {
    if (!map) {
      return;
    }

    const boundsListener = map.addListener('bounds_changed', () => {
      const rawBounds = map.getBounds();
      const ne = rawBounds?.getNorthEast();
      const sw = rawBounds?.getSouthWest();

      setMapBounds({
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
    });

    return () => sdkRef.current?.event.removeListener(boundsListener);
  }, [map, sdkRef.current, setMapBounds]);

  useEffect(() => {
    if (map && focusPoint?.lat && focusPoint?.lng) {
      map.panTo({ lat: focusPoint.lat, lng: focusPoint.lng });

      // setting the zoom when it is already at the correct zoom level
      // causes the pan animation to not work
      if (map.getZoom() !== 13) {
        map.setZoom(13);
      }
    }
  }, [map, focusPoint?.lat, focusPoint?.lng]);

  useEffect(() => {
    setEdgeHighlights(calculateEdgeHighlights(map, hoverPoint));

    const listener = map?.addListener('bounds_changed', () => {
      setEdgeHighlights(calculateEdgeHighlights(map, hoverPoint));
    });

    return () => listener && google.maps.event.removeListener(listener);
  }, [map, hoverPoint?.lat, hoverPoint?.lng]);

  useEffect(() => {
    if (
      sdkRef.current &&
      selectedProperty &&
      highlightedLandmark &&
      map &&
      directionsRendererRef.current
    ) {
      const startPoint = selectedProperty.location;
      const endPoint = highlightedLandmark.model.location;

      if (startPoint.lat && startPoint.lng && endPoint.lat && endPoint.lng) {
        const key = `${startPoint.lat}-${startPoint.lng}-${endPoint.lat}-${endPoint.lng}`;
        const result = cachedDirections.get(key);

        if (result && directionsRendererRef.current) {
          renderDirections(map, directionsRendererRef.current, result);
          return;
        }

        const directions = new sdkRef.current.DirectionsService();
        directions.route(
          {
            origin: {
              lat: startPoint.lat,
              lng: startPoint.lng,
            },
            destination: {
              lat: endPoint.lat,
              lng: endPoint.lng,
            },
            travelMode: sdkRef.current.TravelMode.DRIVING,
          },
          (result, status: google.maps.DirectionsStatus) => {
            if (
              status === 'OK' &&
              result &&
              map &&
              directionsRendererRef.current
            ) {
              cachedDirections.set(key, result);
              renderDirections(map, directionsRendererRef.current, result);
            }
          },
        );
      }
    } else if (map && directionsRendererRef.current) {
      renderDirections(map, directionsRendererRef.current, null);
    }

    return () => {
      if (map && directionsRendererRef.current) {
        renderDirections(map, directionsRendererRef.current, null);
      }
    };
  }, [
    map,
    sdkRef.current,
    selectedProperty,
    highlightedLandmark,
    directionsRendererRef.current,
  ]);

  return (
    <div
      className={cx(styles.container, {
        [styles.landmarkHighlighted]: !!highlightedLandmark,
      })}
      ref={containerRef}
    >
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
