import { useContext } from 'react';

import { GoogleMapContext } from '@/contexts/GoogleMap';

export function useGoogleMap() {
  const { map } = useContext(GoogleMapContext);
  return map;
}
