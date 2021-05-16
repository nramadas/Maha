import cx from 'classnames';
import React from 'react';

import { Bed } from '@/components/icons/Bed';
import { Drop } from '@/components/icons/Drop';
import { DropEmpty } from '@/components/icons/DropEmpty';
import { House } from '@/components/icons/House';
import { Marker } from '@/components/maps/Marker';
import { Body2 } from '@/components/typography/Body2';
import { Caption } from '@/components/typography/Caption';
import { toShortString } from '@/lib/number';
import { Media } from '@/models/Media';
import { Property } from '@/models/Property';

import styles from './index.module.scss';

export type MarkerModel = Pick<
  Property,
  | 'location'
  | 'name'
  | 'numBathrooms'
  | 'numBathroomsHalf'
  | 'numBedrooms'
  | 'price'
  | 'sqft'
> & {
  media: Pick<Media, 'src'>[];
};

interface Props {
  hovered?: boolean;
  property: MarkerModel;
  onHoverChange?(hovered: boolean): void;
}

export function PropertyMarker(props: Props) {
  const { property } = props;
  const { lat, lng } = property.location;

  if (!(lat && lng)) {
    return null;
  }

  const media = property.media[0];

  return (
    <Marker point={{ lat, lng }}>
      <div
        className={cx(styles.container, {
          [styles.hovered]: !!props.hovered,
        })}
        onMouseEnter={() => props.onHoverChange?.(true)}
        onMouseLeave={() => props.onHoverChange?.(false)}
      >
        <div className={styles.extraInfo}>
          <div className={styles.image}>
            {media && <img className={styles.previewImage} src={media.src} />}
          </div>
          <div className={styles.metadata}>
            <Body2 className={styles.name}>{property.name}</Body2>
            <div className={styles.extraInfoGrid}>
              {!!property.sqft && (
                <div className={styles.infoRow}>
                  <House className={styles.icon} />
                  <Caption>{property.sqft} sqft</Caption>
                </div>
              )}
              {!!property.numBedrooms && (
                <div className={styles.infoRow}>
                  <Bed className={styles.icon} />
                  <Caption>{property.numBedrooms}</Caption>
                </div>
              )}
              {!!property.numBathrooms && (
                <div className={styles.infoRow}>
                  <Drop className={styles.icon} />
                  <Caption>{property.numBathrooms}</Caption>
                </div>
              )}
              {!!property.numBathroomsHalf && (
                <div className={styles.infoRow}>
                  <DropEmpty className={styles.icon} />
                  <Caption>{property.numBathroomsHalf}</Caption>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.text}>
          <Body2>₹{toShortString(property.price)}</Body2>
        </div>
        <div className={styles.pin} />
      </div>
    </Marker>
  );
}
