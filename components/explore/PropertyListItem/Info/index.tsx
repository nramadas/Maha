import cx from 'classnames';
import React from 'react';

import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { Caption } from '@/components/typography/Caption';
import { H6 } from '@/components/typography/H6';
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
  return (
    <footer className={cx(props.className, styles.container)}>
      <H6>₹{toString(props.property.price)}</H6>
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
