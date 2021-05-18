import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import React, { memo } from 'react';

import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { Caption } from '@/components/typography/Caption';
import { H5 } from '@/components/typography/H5';
import { Overline } from '@/components/typography/Overline';
import { cleanAddress } from '@/lib/cleanAddress';
import { toString } from '@/lib/number';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
  property: MapPropertyModel;
}

function pick(property: MapPropertyModel) {
  return {
    address: property.location.address,
    numBathrooms: property.numBathrooms,
    numBedrooms: property.numBedrooms,
    price: property.price,
    sqft: property.sqft,
  };
}

function areEqual(prevProps: Props, nextProps: Props) {
  return isEqual(pick(prevProps.property), pick(nextProps.property));
}

export const Info = memo(function Info(props: Props) {
  const { address, numBathrooms, numBedrooms, price, sqft } = pick(
    props.property,
  );
  const priceStr = toString(price);
  const [whole, fractional] = priceStr.split('.');
  const priceParts = whole.split(',');

  return (
    <footer className={cx(props.className, styles.container)}>
      <div className={styles.price}>
        <H5>
          <span className={styles.priceRupee}>₹</span>
          {priceParts.map((p, i) => (
            <React.Fragment key={i}>
              {p}
              {i !== priceParts.length - 1 && (
                <span className={styles.priceSymbol}>,</span>
              )}
            </React.Fragment>
          ))}
        </H5>
        {fractional && (
          <Caption className={styles.priceSymbol}>.{fractional}</Caption>
        )}
      </div>
      <div className={styles.metadata}>
        <div className={styles.address}>
          <Caption>{cleanAddress(address)}</Caption>
        </div>
        <div className={styles.extra}>
          <div className={styles.extraCol}>
            <div>
              <Caption>{numBedrooms}</Caption>
            </div>
            <div>
              <Overline>
                <i18n.Translate>bed</i18n.Translate>
              </Overline>
            </div>
          </div>
          <div className={styles.extraCol}>
            <div>
              <Caption>{numBathrooms}</Caption>
            </div>
            <div>
              <Overline>
                <i18n.Translate>bath</i18n.Translate>
              </Overline>
            </div>
          </div>
          <div className={styles.extraCol}>
            <div>
              <Caption>{toString(sqft)}</Caption>
            </div>
            <div>
              <Overline>
                <i18n.Translate>sqft</i18n.Translate>
              </Overline>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}, areEqual);
