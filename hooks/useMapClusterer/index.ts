import { useContext } from 'react';

import { GoogleMapContext } from '@/contexts/GoogleMap';

export function useMapClusterer() {
  const { clusterer } = useContext(GoogleMapContext);
  return clusterer;
}
