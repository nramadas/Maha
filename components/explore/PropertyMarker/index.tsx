import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import React, { memo } from 'react';

import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { Bed } from '@/components/icons/Bed';
import { Drop } from '@/components/icons/Drop';
import { DropEmpty } from '@/components/icons/DropEmpty';
import { House } from '@/components/icons/House';
import { Marker } from '@/components/maps/Marker';
import { Body2 } from '@/components/typography/Body2';
import { Caption } from '@/components/typography/Caption';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import {
  useHoveredProperty,
  useSelectedProperty,
} from '@/hooks/useExplorePage';
import { toShortString } from '@/lib/number';

import styles from './index.module.scss';

interface Props {
  property: MapPropertyModel;
}

function pick(property: MapPropertyModel) {
  return {
    address: property.location.address,
    id: property.id,
    image: property.media[0]?.src,
    lat: property.location.lat,
    lng: property.location.lng,
    numBathrooms: property.numBathrooms,
    numBathroomsHalf: property.numBathroomsHalf,
    numBedrooms: property.numBedrooms,
    price: property.price,
    sqft: property.sqft,
  };
}

function areEqual(prevProps: Props, nextProps: Props) {
  return isEqual(pick(prevProps.property), pick(nextProps.property));
}

export const PropertyMarker = memo(function PropertyMarker(props: Props) {
  const {
    hoveredProperty,
    setHoveredProperty,
  } = useHoveredProperty<MapPropertyModel>();
  const { setSelectedProperty } = useSelectedProperty<MapPropertyModel>();
  const [openDetails] = useBottomSheet(props.property.id);

  const { property } = props;

  const {
    address,
    id,
    image,
    lat,
    lng,
    numBathrooms,
    numBathroomsHalf,
    numBedrooms,
    price,
    sqft,
  } = pick(property);

  const hovered = hoveredProperty?.id === id;

  if (!(lat && lng)) {
    return null;
  }

  return (
    <Marker excludeFromCluster={hovered} point={{ lat, lng }}>
      <div
        className={cx(styles.container, {
          [styles.hovered]: !!hovered,
        })}
        onClick={() => {
          setSelectedProperty(property);
          openDetails();
        }}
        onMouseEnter={() => setHoveredProperty(property)}
        onMouseLeave={() =>
          hoveredProperty?.id === id && setHoveredProperty(null)
        }
      >
        <div className={styles.extraInfo}>
          <div className={styles.image}>
            {image && <img className={styles.previewImage} src={image} />}
          </div>
          <div className={styles.metadata}>
            <Body2 className={styles.name}>{address}</Body2>
            <div className={styles.extraInfoGrid}>
              {!!sqft && (
                <div className={styles.infoRow}>
                  <House className={styles.icon} />
                  <Caption>{sqft} sqft</Caption>
                </div>
              )}
              {!!numBedrooms && (
                <div className={styles.infoRow}>
                  <Bed className={styles.icon} />
                  <Caption>{numBedrooms}</Caption>
                </div>
              )}
              {!!numBathrooms && (
                <div className={styles.infoRow}>
                  <Drop className={styles.icon} />
                  <Caption>{numBathrooms}</Caption>
                </div>
              )}
              {!!numBathroomsHalf && (
                <div className={styles.infoRow}>
                  <DropEmpty className={styles.icon} />
                  <Caption>{numBathroomsHalf}</Caption>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.text}>
          <Body2>₹{toShortString(price)}</Body2>
        </div>
        <div className={styles.pin} />
      </div>
    </Marker>
  );
}, areEqual);
