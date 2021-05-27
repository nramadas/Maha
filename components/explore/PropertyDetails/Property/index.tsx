import cx from 'classnames';
import React, { memo } from 'react';

import { PropertyDetailsModel } from '../model';
import { DetailedMediaCarousel } from '@/components/DetailedMediaCarousel';
import { Close } from '@/components/icons/Close';
import { Body2 } from '@/components/typography/Body2';
import { H2 } from '@/components/typography/H2';
import { H4 } from '@/components/typography/H4';
import { H5 } from '@/components/typography/H5';
import { Overline } from '@/components/typography/Overline';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { useSelectedProperty } from '@/hooks/useExplorePage';
import { cleanAddress } from '@/lib/cleanAddress';
import { toString } from '@/lib/number';
import { i18n } from '@/lib/translate';

import { Amenities } from './Amenities';
import { Details } from './Details';
import styles from './index.module.scss';
import { Other } from './Other';
import { Parking } from './Parking';
import { Schools } from './Schools';
import { Section } from './Section';
import { Utilities } from './Utilities';

interface Props {
  property: PropertyDetailsModel;
}

export const Property = memo(function Property(props: Props) {
  const { property } = props;

  const [, closeDetails] = useBottomSheet(property.id);
  const { setSelectedProperty } = useSelectedProperty();

  const priceStr = toString(property.price);
  const [wholePrice, fractionalPrice] = priceStr.split('.');

  return (
    <>
      <header className={styles.header}>
        <H4>{property.name}</H4>
        <Close
          className={styles.close}
          onClick={() => {
            closeDetails();
            setSelectedProperty(null);
          }}
        />
      </header>
      <div className={styles.content}>
        <div className={styles.price}>
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
        <div className={styles.media}>
          <DetailedMediaCarousel
            className={styles.image}
            media={property.media}
            numVisible={2}
          />
        </div>
        <div
          className={styles.infoGrid}
          style={{
            // @ts-ignore
            '--num-extra': property.numBathroomsHalf ? 4 : 3,
          }}
        >
          <Overline className={styles.label}>
            <i18n.Translate>address</i18n.Translate>
          </Overline>
          <Overline className={cx(styles.label, styles.infoCenter)}>
            <i18n.Translate>sqft</i18n.Translate>
          </Overline>
          <Overline className={cx(styles.label, styles.infoCenter)}>
            <i18n.Translate>bed</i18n.Translate>
          </Overline>
          <Overline className={cx(styles.label, styles.infoCenter)}>
            <i18n.Translate>bath</i18n.Translate>
          </Overline>
          {!!property.numBathroomsHalf && (
            <Overline className={cx(styles.label, styles.infoCenter)}>
              <i18n.Translate>½ bath</i18n.Translate>
            </Overline>
          )}
          <Body2>{cleanAddress(property.location.address)}</Body2>
          <Body2 className={styles.infoCenter}>{toString(property.sqft)}</Body2>
          <Body2 className={styles.infoCenter}>{property.numBedrooms}</Body2>
          <Body2 className={styles.infoCenter}>{property.numBathrooms}</Body2>
          {!!property.numBathroomsHalf && (
            <Body2 className={styles.infoCenter}>
              {property.numBathroomsHalf}
            </Body2>
          )}
        </div>
        <Section title={i18n.translate`property details`}>
          <Details className={styles.details} property={property} />
        </Section>
        <Section title={i18n.translate`amenities`}>
          <Amenities className={styles.details} property={property} />
        </Section>
        <Section title={i18n.translate`schools`}>
          <Schools className={styles.details} property={property} />
        </Section>
        <Section title={i18n.translate`parking`}>
          <Parking className={styles.details} property={property} />
        </Section>
        <Section title={i18n.translate`utilities`}>
          <Utilities className={styles.details} property={property} />
        </Section>
        {(property.constructionMaterials?.en ||
          property.securityFeatures?.en) && (
          <Section title={i18n.translate`other features`}>
            <Other className={styles.details} property={property} />
          </Section>
        )}
      </div>
    </>
  );
});
