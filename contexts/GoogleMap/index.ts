import type MarkerClusterer from '@googlemaps/markerclustererplus';
import { createContext } from 'react';

export interface GoogleMapDetails {
  clusterer: MarkerClusterer | null;
  map: google.maps.Map | null;
}

export const GoogleMapContext = createContext<GoogleMapDetails>({
  clusterer: null,
  map: null,
});
