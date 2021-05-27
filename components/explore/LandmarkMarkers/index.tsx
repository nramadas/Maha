import React, { memo } from 'react';

import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { SchoolMarker } from '@/components/explore/SchoolMarker';
import { useHighlightedLandmark } from '@/hooks/useExplorePage';
import { LandmarkType } from '@/models/LandmarkType';

type School = MapPropertyModel['schools'][number];

interface Props {}

export const LandmarkMarkers = memo(function LandmarkMarkers(props: Props) {
  const { highlightedLandmark } = useHighlightedLandmark<School>();

  return (
    <>
      {highlightedLandmark &&
        highlightedLandmark.type === LandmarkType.School && (
          <SchoolMarker
            key={highlightedLandmark.model.id}
            school={highlightedLandmark.model}
          />
        )}
    </>
  );
});
