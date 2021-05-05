import React from 'react';

import { Radio } from '@/components/controls/Radio';
import { Select } from '@/components/controls/Select';
import { Body2 } from '@/components/typography/Body2';
import { Overline } from '@/components/typography/Overline';
import { enumToText as amenityAccessToText } from '@/lib/enumToText/amenityAccess';
import { i18n } from '@/lib/translate';
import { AmenityAccess } from '@/models/AmenityAccess';

import styles from './index.module.scss';

export function Amenities() {
  return (
    <>
      <p>
        <Overline>
          <i18n.Translate>Amenities</i18n.Translate>
        </Overline>
      </p>
      <div className={styles.grid}>
        <div className={styles.label}>
          <Body2>
            <i18n.Translate>Gym / fitness center:</i18n.Translate>
          </Body2>
        </div>
        <div className={styles.radioGroup}>
          <Radio name="amenitiesGym" value label={i18n.translate`Yes`} />
          <Radio name="amenitiesGym" value={false} label={i18n.translate`No`} />
        </div>

        <div className={styles.label}>
          <Body2>
            <i18n.Translate>On site security:</i18n.Translate>
          </Body2>
        </div>
        <div className={styles.radioGroup}>
          <Radio name="amenitiesSecurity" value label={i18n.translate`Yes`} />
          <Radio
            name="amenitiesSecurity"
            value={false}
            label={i18n.translate`No`}
          />
        </div>

        <div className={styles.label}>
          <Body2>
            <i18n.Translate>Swimming pool:</i18n.Translate>
          </Body2>
        </div>
        <Select
          name="amenitiesPool"
          options={Object.values(AmenityAccess).map(access => ({
            text: amenityAccessToText(access),
            value: access,
          }))}
          placeholder={i18n.translate`select`}
        >
          {option => <Body2>{option.text}</Body2>}
        </Select>

        <div className={styles.label}>
          <Body2>
            <i18n.Translate>Grill:</i18n.Translate>
          </Body2>
        </div>
        <Select
          name="amenitiesGrill"
          options={Object.values(AmenityAccess).map(access => ({
            text: amenityAccessToText(access),
            value: access,
          }))}
          placeholder={i18n.translate`select`}
        >
          {option => <Body2>{option.text}</Body2>}
        </Select>
      </div>
    </>
  );
}
