import React from 'react';

import { Radio } from '@/components/controls/Radio';
import { Select } from '@/components/controls/Select';
import { Body2 } from '@/components/typography/Body2';
import { Overline } from '@/components/typography/Overline';
import { enumToText as amenityAccessToText } from '@/lib/enumToText/amenityAccess';
import { enumToText as utilityConfigurationToText } from '@/lib/enumToText/utilityConfiguration';
import { enumToText as utilityGasTypeToText } from '@/lib/enumToText/utilityGasType';
import { enumToText as utilityWaterFilterToText } from '@/lib/enumToText/utilityWaterFilter';
import { i18n } from '@/lib/translate';
import { AmenityAccess } from '@/models/AmenityAccess';
import { UtilityConfiguration } from '@/models/UtilityConfiguration';
import { UtilityGasType } from '@/models/UtilityGasType';
import { UtilityWaterFilter } from '@/models/UtilityWaterFilter';

import styles from './index.module.scss';

export function Utilities() {
  return (
    <>
      <p>
        <Overline>
          <i18n.Translate>Utilities</i18n.Translate>
        </Overline>
      </p>
      <div className={styles.grid}>
        <div className={styles.label}>
          <Body2>
            <i18n.Translate>Dishwasher:</i18n.Translate>
          </Body2>
        </div>
        <div className={styles.radioGroup}>
          <Radio
            name="appliancesDishwasher"
            value={{ value: true }}
            label={i18n.translate`Yes`}
          />
          <Radio
            name="appliancesDishwasher"
            value={{ value: false }}
            label={i18n.translate`No`}
          />
        </div>

        <div className={styles.label}>
          <Body2>
            <i18n.Translate>Air conditioning:</i18n.Translate>
          </Body2>
        </div>
        <Select
          name="utilitiesAirConditioning"
          options={Object.values(UtilityConfiguration).map(configuration => ({
            text: utilityConfigurationToText(configuration),
            value: configuration,
          }))}
          placeholder={i18n.translate`select`}
        >
          {option => <Body2>{option.text}</Body2>}
        </Select>

        <div className={styles.label}>
          <Body2>
            <i18n.Translate>Heating:</i18n.Translate>
          </Body2>
        </div>
        <Select
          name="utilitiesHeating"
          options={Object.values(UtilityConfiguration).map(configuration => ({
            text: utilityConfigurationToText(configuration),
            value: configuration,
          }))}
          placeholder={i18n.translate`select`}
        >
          {option => <Body2>{option.text}</Body2>}
        </Select>

        <div className={styles.label}>
          <Body2>
            <i18n.Translate>Clothes washer:</i18n.Translate>
          </Body2>
        </div>
        <Select
          name="appliancesWasher"
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
            <i18n.Translate>Clothes dryer</i18n.Translate>
          </Body2>
        </div>
        <Select
          name="appliancesDryer"
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
            <i18n.Translate>Cooking gas:</i18n.Translate>
          </Body2>
        </div>
        <Select
          name="utilitiesGasType"
          options={Object.values(UtilityGasType).map(type => ({
            text: utilityGasTypeToText(type),
            value: type,
          }))}
          placeholder={i18n.translate`select`}
        >
          {option => <Body2>{option.text}</Body2>}
        </Select>

        <div className={styles.label}>
          <Body2>
            <i18n.Translate>Water filter:</i18n.Translate>
          </Body2>
        </div>
        <Select
          name="utilitiesWaterFilter"
          options={Object.values(UtilityWaterFilter).map(filter => ({
            text: utilityWaterFilterToText(filter),
            value: filter,
          }))}
          placeholder={i18n.translate`select`}
        >
          {option => <Body2>{option.text}</Body2>}
        </Select>
      </div>
    </>
  );
}
