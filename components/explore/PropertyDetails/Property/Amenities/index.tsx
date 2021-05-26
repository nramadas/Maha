import cx from 'classnames';
import React, { memo } from 'react';

import { PropertyDetailsModel } from '../../model';
import { Body2 } from '@/components/typography/Body2';
import { useTextToString } from '@/hooks/useTextToString';
import { enumToText as amenityAccessToText } from '@/lib/enumToText/amenityAccess';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
  property: PropertyDetailsModel;
}

export const Amenities = memo(function Amenities(props: Props) {
  const { className, property } = props;
  const textToString = useTextToString();

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.columnGrid}>
        <Body2>
          <i18n.Translate>Dishwasher</i18n.Translate>
        </Body2>
        <Body2>
          {property.appliancesDishwasher ? (
            <i18n.Translate>Yes</i18n.Translate>
          ) : (
            <i18n.Translate>No</i18n.Translate>
          )}
        </Body2>
        <Body2>
          <i18n.Translate>Clothes washer</i18n.Translate>
        </Body2>
        <Body2>
          {textToString(amenityAccessToText(property.appliancesWasher))}
        </Body2>
        <Body2>
          <i18n.Translate>Clothes dryer</i18n.Translate>
        </Body2>
        <Body2>
          {textToString(amenityAccessToText(property.appliancesDryer))}
        </Body2>
        <Body2>
          <i18n.Translate>Grill</i18n.Translate>
        </Body2>
        <Body2>
          {textToString(amenityAccessToText(property.amenitiesGrill))}
        </Body2>
      </div>
      <div className={styles.columnGrid}>
        <Body2>
          <i18n.Translate>Gym</i18n.Translate>
        </Body2>
        <Body2>
          {property.amenitiesGym ? (
            <i18n.Translate>Yes</i18n.Translate>
          ) : (
            <i18n.Translate>No</i18n.Translate>
          )}
        </Body2>
        <Body2>
          <i18n.Translate>Pool</i18n.Translate>
        </Body2>
        <Body2>
          {textToString(amenityAccessToText(property.amenitiesPool))}
        </Body2>
        <Body2>
          <i18n.Translate>Security</i18n.Translate>
        </Body2>
        <Body2>
          {property.amenitiesSecurity ? (
            <i18n.Translate>Yes</i18n.Translate>
          ) : (
            <i18n.Translate>No</i18n.Translate>
          )}
        </Body2>
      </div>
    </div>
  );
});
