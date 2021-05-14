import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useGoogleMap } from '@/hooks/useGoogleMap';
import { useGoogleMapsSDK } from '@/hooks/useGoogleMapsSDK';
import { MapPoint } from '@/models/MapPoint';

interface MarkerArgs {
  point: MapPoint;
  map: google.maps.Map;
}

function createMarker(sdk: typeof google.maps) {
  return class MarkerContainer extends sdk.OverlayView {
    div: HTMLDivElement | null;
    latlng: google.maps.LatLng;

    constructor(args: MarkerArgs) {
      super();
      this.div = document.createElement('div');
      this.latlng = new google.maps.LatLng(args.point);
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

    remove() {
      if (this.div) {
        this.div.parentNode?.removeChild(this.div);
        this.div = null;
      }
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

  if (ready && markerRef.current && markerRef.current.div) {
    return createPortal(props.children, markerRef.current.div);
  } else {
    return null;
  }
}
