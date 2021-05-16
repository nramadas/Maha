import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef, DependencyList } from 'react';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  mapIds: ['a9f896913d80858a'],
  version: 'beta',
});

const load = (() => {
  let cachedValue: null | Promise<typeof google.maps> = null;

  return () => {
    if (typeof window === 'undefined') {
      return null;
    } else {
      if (!cachedValue) {
        cachedValue = loader.load().then(() => {
          return google.maps;
        });
      }

      return cachedValue;
    }
  };
})();

export function useGoogleMapsSDK(
  cb: (sdk: typeof google.maps) => void,
  deps?: DependencyList,
) {
  const deconstructRef = useRef<any>(null);

  useEffect(() => {
    const sdkLoad = load();

    if (sdkLoad) {
      sdkLoad.then(mapsSdk => {
        deconstructRef.current = cb(mapsSdk);
      });
    }

    return () => {
      if (deconstructRef.current) {
        return deconstructRef.current();
      }
    };
  }, deps || []);
}
