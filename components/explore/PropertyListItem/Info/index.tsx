import cx from 'classnames';
import React from 'react';

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

export function Info(props: Props) {
  const priceStr = toString(props.property.price);
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
          <Caption>{cleanAddress(props.property.location.address)}</Caption>
        </div>
        <div className={styles.extra}>
          <div className={styles.extraCol}>
            <div>
              <Caption>{props.property.numBedrooms}</Caption>
            </div>
            <div>
              <Overline>
                <i18n.Translate>bed</i18n.Translate>
              </Overline>
            </div>
          </div>
          <div className={styles.extraCol}>
            <div>
              <Caption>{props.property.numBathrooms}</Caption>
            </div>
            <div>
              <Overline>
                <i18n.Translate>bath</i18n.Translate>
              </Overline>
            </div>
          </div>
          <div className={styles.extraCol}>
            <div>
              <Caption>{toString(props.property.sqft)}</Caption>
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
}
