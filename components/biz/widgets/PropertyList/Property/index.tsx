import { gql } from '@urql/core';
import cx from 'classnames';
import isNil from 'lodash/isNil';
import Link from 'next/link';
import React from 'react';
import { useMutation } from 'urql';

import { Empty } from '@/components/controls/links/Empty';
import { Bed } from '@/components/icons/Bed';
import { Drop } from '@/components/icons/Drop';
import { DropEmpty } from '@/components/icons/DropEmpty';
import { House } from '@/components/icons/House';
import { Image as ImageIcon } from '@/components/icons/Image';
import { Body1 } from '@/components/typography/Body1';
import { Body2 } from '@/components/typography/Body2';
import { H6 } from '@/components/typography/H6';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toString } from '@/lib/number';
import { BizRoute, fullBizRoute } from '@/lib/route';
import { i18n } from '@/lib/translate';
import { Media as MediaModel } from '@/models/Media';
import { Property as BasePropertyModel } from '@/models/Property';

import styles from './index.module.scss';

const deleteProperty = gql`
  mutation($id: ID!) {
    removeProperty(id: $id) {
      id
      properties {
        id
      }
    }
  }
`;

export interface PropertyModel
  extends Pick<
    BasePropertyModel,
    | 'id'
    | 'location'
    | 'numBedrooms'
    | 'numBathrooms'
    | 'numBathroomsHalf'
    | 'price'
    | 'name'
    | 'quantity'
    | 'sqft'
  > {
  media: Pick<MediaModel, 'id' | 'type' | 'src'>[];
}

interface Props {
  className?: string;
  property: PropertyModel;
}

export function Property(props: Props) {
  const confirm = useConfirmation();
  const [, removeProperty] = useMutation(deleteProperty);

  return (
    <article className={cx(styles.container, props.className)}>
      <div className={styles.thumbnail}>
        {props.property.media?.length ? (
          <img className={styles.image} src={props.property.media[0].src} />
        ) : (
          <ImageIcon className={styles.imageIcon} />
        )}
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <H6>{props.property.name}</H6>
          {!isNil(props.property.quantity) && (
            <div className={styles.quantity}>
              <Body1>
                •&nbsp;
                <i18n.Translate>
                  <i18n.Param name="quantity" count={props.property.quantity}>
                    {props.property.quantity}
                  </i18n.Param>{' '}
                  units
                </i18n.Translate>
              </Body1>
            </div>
          )}
        </header>
        <div>
          <Body2>{props.property.location.address}</Body2>
        </div>
        <div className={styles.metaDataRow}>
          <div className={styles.metaData}>
            <House />
            <Body2>{toString(props.property.sqft)} sqft</Body2>
          </div>
          <div className={styles.metaData}>
            <Body2>
              <span className={styles.rupee}>₹</span>
              {toString(props.property.price)}
            </Body2>
          </div>
          <div className={styles.metaData}>
            <Bed />
            <Body2>{props.property.numBedrooms}&nbsp;/&nbsp;</Body2>
            <Drop />
            <Body2>{props.property.numBathrooms}</Body2>
            {!!props.property.numBathroomsHalf && (
              <>
                <Body2>&nbsp;/&nbsp;</Body2>
                <DropEmpty />
                <Body2>{props.property.numBathroomsHalf}</Body2>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <Link
          href={fullBizRoute(BizRoute.EditProperty) + '/' + props.property.id}
        >
          <Empty>
            <i18n.Translate>Edit</i18n.Translate>
          </Empty>
        </Link>
        <Empty
          onClick={() =>
            confirm(
              i18n.translate`Are you sure you want to delete this property?`,
            ).then(() => removeProperty({ id: props.property.id }))
          }
        >
          <i18n.Translate>Delete</i18n.Translate>
        </Empty>
      </div>
    </article>
  );
}
