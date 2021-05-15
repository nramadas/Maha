import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useGoogleMap } from '@/hooks/useGoogleMap';
import { useGoogleMapsSDK } from '@/hooks/useGoogleMapsSDK';
import { useMapClusterer } from '@/hooks/useMapClusterer';
import { MapPoint } from '@/models/MapPoint';

interface MarkerArgs {
  point: MapPoint;
  map: google.maps.Map;
}

function createMarker(sdk: typeof google.maps) {
  return class MarkerContainer extends sdk.OverlayView {
    div: HTMLDivElement | null;
    latlng: google.maps.LatLng;
    visible: boolean;

    constructor(args: MarkerArgs) {
      super();
      this.div = document.createElement('div');
      this.latlng = new google.maps.LatLng(args.point);
      this.visible = true;
      this.setMap(args.map);
    }

    draw() {
      const point = this.getProjection().fromLatLngToDivPixel(this.latlng);

      if (point && this.div) {
        this.div.style.position = 'absolute';
        this.div.style.left = `${point.x}px`;
        this.div.style.top = `${point.y}px`;
      }
    }

    getDraggable() {
      return false;
    }

    getPosition() {
      return this.latlng;
    }

    getVisible() {
      return this.visible;
    }

    remove() {
      if (this.div) {
        this.div.parentNode?.removeChild(this.div);
      }
    }

    setVisible(visible: boolean) {
      this.visible = visible;
    }

    onAdd() {
      const panes = this.getPanes();

      if (this.div && panes) {
        panes.overlayMouseTarget.appendChild(this.div);
      }
    }
  };
}

type RawMaker = ReturnType<typeof createMarker>;

interface Props {
  children?: React.ReactNode;
  point: MapPoint;
}

export function Marker(props: Props) {
  const clusterer = useMapClusterer();
  const map = useGoogleMap();
  const markerRef = useRef<InstanceType<RawMaker> | null>(null);
  const [ready, setReady] = useState(false);

  useGoogleMapsSDK(
    sdk => {
      if (map) {
        const MarkerClass = createMarker(sdk);

        markerRef.current = new MarkerClass({
          map,
          point: props.point,
        });

        setReady(true);
      } else {
        setReady(false);
      }
    },
    [map],
  );

  useEffect(() => {
    if (map && clusterer && markerRef.current) {
      clusterer.addMarker(markerRef.current as any);
    }
  }, [map, clusterer, ready]);

  if (ready && markerRef.current && markerRef.current.div) {
    return createPortal(props.children, markerRef.current.div);
  } else {
    return null;
  }
}
