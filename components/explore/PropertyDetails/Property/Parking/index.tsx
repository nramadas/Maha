import cx from 'classnames';
import React, { memo } from 'react';

import { PropertyDetailsModel } from '../../model';
import { Body2 } from '@/components/typography/Body2';
import { toString } from '@/lib/number';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
  property: PropertyDetailsModel;
}

export const Parking = memo(function Parking(props: Props) {
  const { className, property } = props;

  return (
    <div className={cx(styles.container, className)}>
      <Body2>
        <i18n.Translate>Parking available</i18n.Translate>
      </Body2>
      <Body2>
        {property.parkingGarage ? (
          <i18n.Translate>Yes</i18n.Translate>
        ) : (
          <i18n.Translate>No</i18n.Translate>
        )}
      </Body2>
      {property.parkingGarage && (
        <>
          <Body2>
            <i18n.Translate>Covered spaces</i18n.Translate>
          </Body2>
          <Body2>{toString(property.parkingCoveredSpaces)}</Body2>
          <Body2>
            <i18n.Translate>Open spaces</i18n.Translate>
          </Body2>
          <Body2>{toString(property.parkingOpenSpaces)}</Body2>
        </>
      )}
    </div>
  );
});
