import React, { memo } from 'react';

import { PropertyDetailsModel } from '../model';
import { Close } from '@/components/icons/Close';
import { Body2 } from '@/components/typography/Body2';
import { H2 } from '@/components/typography/H2';
import { H4 } from '@/components/typography/H4';
import { H5 } from '@/components/typography/H5';
import { Overline } from '@/components/typography/Overline';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { toString } from '@/lib/number';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  property: PropertyDetailsModel;
}

export const Property = memo(function Property(props: Props) {
  const { property } = props;

  const [, closeDetails] = useBottomSheet(property.id);

  const priceStr = toString(property.price);
  const [wholePrice, fractionalPrice] = priceStr.split('.');

  return (
    <>
      <header className={styles.header}>
        <H4>{property.name}</H4>
        <Close className={styles.close} onClick={closeDetails} />
      </header>
      <div className={styles.price}>
        <Overline className={styles.label}>
          <i18n.Translate>price</i18n.Translate>
        </Overline>
        <div className={styles.priceLine}>
          <H2>
            <span className={styles.priceRupee}>₹</span>
            {wholePrice}
          </H2>
          {fractionalPrice && (
            <H5 className={styles.priceFractional}>.{fractionalPrice}</H5>
          )}
        </div>
      </div>
      <div className={styles.address}>
        <Overline className={styles.label}>
          <i18n.Translate>address</i18n.Translate>
        </Overline>
        <Body2>{property.location.address}</Body2>
      </div>
    </>
  );
});
