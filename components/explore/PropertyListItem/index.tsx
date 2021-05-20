import cx from 'classnames';
import React, { memo } from 'react';

import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { PreviewMediaCarousel } from '@/components/PreviewMediaCarousel';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import {
  useHoveredProperty,
  useSelectedProperty,
} from '@/hooks/useExplorePage';

import styles from './index.module.scss';
import { Info } from './Info';

interface Props {
  className?: string;
  property: MapPropertyModel;
}

export const PropertyListItem = memo(function PropertyListItem(props: Props) {
  const {
    hoveredProperty,
    setHoveredProperty,
  } = useHoveredProperty<MapPropertyModel>();
  const { setSelectedProperty } = useSelectedProperty();
  const [openDetails] = useBottomSheet(props.property.id);

  return (
    <div
      className={cx(styles.container, props.className, {
        [styles.hovered]: hoveredProperty?.id === props.property.id,
      })}
      onClick={() => {
        setSelectedProperty(props.property);
        openDetails();
      }}
      onMouseEnter={() => setHoveredProperty(props.property)}
      onMouseLeave={() =>
        hoveredProperty?.id === props.property.id && setHoveredProperty(null)
      }
    >
      <PreviewMediaCarousel media={props.property.media} />
      <Info className={styles.info} property={props.property} />
    </div>
  );
});
