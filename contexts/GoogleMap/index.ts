import { createContext } from 'react';

export interface GoogleMapDetails {
  map: google.maps.Map | null;
}

export const GoogleMapContext = createContext<GoogleMapDetails>({
  map: null,
});
