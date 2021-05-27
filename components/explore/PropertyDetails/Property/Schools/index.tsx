import cx from 'classnames';
import React, { memo } from 'react';

import { PropertyDetailsModel } from '../../model';
import { Body2 } from '@/components/typography/Body2';
import { Caption } from '@/components/typography/Caption';
import { useHighlightedLandmark } from '@/hooks/useExplorePage';
import { cleanAddress } from '@/lib/cleanAddress';
import { LandmarkType } from '@/models/LandmarkType';

import styles from './index.module.scss';

type School = PropertyDetailsModel['schools'][number];

interface Props {
  className?: string;
  property: PropertyDetailsModel;
}

export const Schools = memo(function Schools(props: Props) {
  const {
    highlightedLandmark,
    setHighlightedLandmark,
  } = useHighlightedLandmark<School>();

  const { className, property } = props;

  return (
    <div className={cx(className, styles.container)}>
      {property.schools.map(school => (
        <div
          className={styles.school}
          key={school.id}
          onMouseEnter={() =>
            setHighlightedLandmark({
              type: LandmarkType.School,
              model: school,
            })
          }
          onMouseLeave={() => {
            if (highlightedLandmark?.model.id === school.id) {
              setHighlightedLandmark(null);
            }
          }}
        >
          <div className={styles.schoolName}>
            <Body2>{school.name}</Body2>
          </div>
          <div>
            <Caption>{cleanAddress(school.location.address)}</Caption>
          </div>
        </div>
      ))}
    </div>
  );
});
