import debounce from 'lodash/debounce';
import React, { memo } from 'react';

import { Form } from '@/components/controls/Form';
import { Input } from '@/components/controls/Input';
import { Number } from '@/components/controls/Number';
import { Price } from '@/components/controls/Price';
import { Select } from '@/components/controls/Select';
import { Switch } from '@/components/controls/Switch';
import { Close } from '@/components/icons/Close';
import { Body2 } from '@/components/typography/Body2';
import { H4 } from '@/components/typography/H4';
import { BottomSheet } from '@/contexts/BottomSheet';
import { DomContainerProvider } from '@/contexts/DomContainer';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { useFilters } from '@/hooks/useExplorePage';
import { enumToText as amenityAccessToText } from '@/lib/enumToText/amenityAccess';
import { enumToText as utilityConfigurationToText } from '@/lib/enumToText/utilityConfiguration';
import { enumToText as utilityGasTypeToText } from '@/lib/enumToText/utilityGasType';
import { enumToText as utilityWaterFilterToText } from '@/lib/enumToText/utilityWaterFilter';
import { i18n } from '@/lib/translate';
import { AmenityAccess } from '@/models/AmenityAccess';
import { AppliedFilters } from '@/models/AppliedFilters';
import { UtilityConfiguration } from '@/models/UtilityConfiguration';
import { UtilityGasType } from '@/models/UtilityGasType';
import { UtilityWaterFilter } from '@/models/UtilityWaterFilter';

import { Footer } from './Footer';
import styles from './index.module.scss';
import { Section } from './Section';

function formToFilters(formValues: any): AppliedFilters {
  return {
    equalsAmenitiesGrill: formValues.equalsAmenitiesGrill
      ? formValues.equalsAmenitiesGrill.value
      : null,
    equalsAmenitiesGym: formValues.equalsAmenitiesGym || null,
    equalsAmenitiesPool: formValues.equalsAmenitiesPool
      ? formValues.equalsAmenitiesPool.value
      : null,
    equalsAppliancesDishwasher: formValues.equalsAppliancesDishwasher || null,
    equalsAppliancesDryer: formValues.equalsAppliancesDryer
      ? formValues.equalsAppliancesDryer.value
      : null,
    equalsAppliancesWasher: formValues.equalsAppliancesWasher
      ? formValues.equalsAppliancesWasher.value
      : null,
    equalsUtilitiesAirConditioning: formValues.equalsUtilitiesAirConditioning
      ? formValues.equalsUtilitiesAirConditioning.value
      : null,
    equalsUtilitiesGasType: formValues.equalsUtilitiesGasType
      ? formValues.equalsUtilitiesGasType.value
      : null,
    equalsUtilitiesHeating: formValues.equalsUtilitiesHeating
      ? formValues.equalsUtilitiesHeating.value
      : null,
    equalsUtilitiesWaterFilter: formValues.equalsUtilitiesWaterFilter
      ? formValues.equalsUtilitiesWaterFilter.value
      : null,
    maxFees: formValues.maxFees || null,
    maxPrice: formValues.maxPrice || null,
    maxSqft: formValues.maxSqft || null,
    maxTaxes: formValues.maxTaxes || null,
    maxYearBuilt: formValues.maxYearBuilt
      ? parseInt(formValues.maxYearBuilt, 10)
      : null,
    minNumBathrooms: formValues.minNumBathrooms || null,
    minNumBedrooms: formValues.minNumBedrooms || null,
    minParkingSpaces: formValues.minParkingSpaces || null,
    minPrice: formValues.minPrice || null,
    minSqft: formValues.minSqft || null,
    minYearBuilt: formValues.minYearBuilt
      ? parseInt(formValues.minYearBuilt, 10)
      : null,
  };
}

function filtersToForm(filters: AppliedFilters): any {
  return {
    equalsAmenitiesGrill: filters.equalsAmenitiesGrill
      ? { value: filters.equalsAmenitiesGrill }
      : null,
    equalsAmenitiesGym: filters.equalsAmenitiesGym || null,
    equalsAmenitiesPool: filters.equalsAmenitiesPool
      ? { value: filters.equalsAmenitiesPool }
      : null,
    equalsAppliancesDishwasher: filters.equalsAppliancesDishwasher || null,
    equalsAppliancesDryer: filters.equalsAppliancesDryer
      ? { value: filters.equalsAppliancesDryer }
      : null,
    equalsAppliancesWasher: filters.equalsAppliancesWasher
      ? { value: filters.equalsAppliancesWasher }
      : null,
    equalsUtilitiesAirConditioning: filters.equalsUtilitiesAirConditioning
      ? { value: filters.equalsUtilitiesAirConditioning }
      : null,
    equalsUtilitiesGasType: filters.equalsUtilitiesGasType
      ? { value: filters.equalsUtilitiesGasType }
      : null,
    equalsUtilitiesHeating: filters.equalsUtilitiesHeating
      ? { value: filters.equalsUtilitiesHeating }
      : null,
    equalsUtilitiesWaterFilter: filters.equalsUtilitiesWaterFilter
      ? { value: filters.equalsUtilitiesWaterFilter }
      : null,
    maxFees: filters.maxFees || null,
    maxPrice: filters.maxPrice || null,
    maxSqft: filters.maxSqft || null,
    maxTaxes: filters.maxTaxes || null,
    maxYearBuilt: filters.maxYearBuilt || null,
    minNumBathrooms: filters.minNumBathrooms || null,
    minNumBedrooms: filters.minNumBedrooms || null,
    minPrice: filters.minPrice || null,
    minSqft: filters.minSqft || null,
    minYearBuilt: filters.minYearBuilt || null,
  };
}

export const SHEET_ID = 'filters';

const _Filters = memo(function _Filters() {
  const { filters, setFilters } = useFilters();
  const [, close] = useBottomSheet(SHEET_ID);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <H4>
          <i18n.Translate>Filters</i18n.Translate>
        </H4>
        <Close className={styles.icon} onClick={close} />
      </header>
      <Form
        className={styles.filters}
        defaultValues={filtersToForm(filters)}
        onChange={debounce(
          formValues => setFilters(formToFilters(formValues)),
          250,
        )}
      >
        <div className={styles.formContent}>
          <DomContainerProvider>
            <div className={styles.col_2}>
              <Section title={i18n.translate`price`}>
                <div className={styles.col_2}>
                  <Price
                    noIcon
                    name="minPrice"
                    label={i18n.translate`min price`}
                  />
                  <Price
                    noIcon
                    name="maxPrice"
                    label={i18n.translate`max price`}
                  />
                </div>
              </Section>
              <Section title={i18n.translate`layout`}>
                <div className={styles.col_2}>
                  <Number
                    name="minNumBedrooms"
                    label={i18n.translate`num beds`}
                  />
                  <Number
                    name="minNumBathrooms"
                    label={i18n.translate`num bath`}
                  />
                </div>
              </Section>
            </div>
            <div className={styles.col_2}>
              <Section title={i18n.translate`property`}>
                <div className={styles.col_2}>
                  <Number name="minSqft" label={i18n.translate`min sqft`} />
                  <Number name="maxSqft" label={i18n.translate`max sqft`} />
                </div>
              </Section>
              <Section title={i18n.translate`year built`}>
                <div className={styles.col_2}>
                  <Input
                    name="minYearBuilt"
                    label={i18n.translate`min year built`}
                  />
                  <Input
                    name="maxYearBuilt"
                    label={i18n.translate`max year built`}
                  />
                </div>
              </Section>
            </div>
            <div className={styles.col_2}>
              <Section title={i18n.translate`taxes & fees`}>
                <div className={styles.col_2}>
                  <Price
                    noIcon
                    name="maxFees"
                    label={i18n.translate`max fees`}
                  />
                  <Price
                    noIcon
                    name="maxTaxes"
                    label={i18n.translate`max taxes`}
                  />
                </div>
              </Section>
              <Section title={i18n.translate`parking`}>
                <div className={styles.col_1}>
                  <Number
                    name="minParkingSpaces"
                    label={i18n.translate`min parking spaces`}
                  />
                </div>
              </Section>
            </div>
            <div className={styles.col_2}>
              <Section title={i18n.translate`appliances`}>
                <div className={styles.col_2_tall}>
                  <Body2>
                    <i18n.Translate>Dishwasher</i18n.Translate>
                  </Body2>
                  <Switch name="equalsAppliancesDishwasher" />
                  <Body2>
                    <i18n.Translate>Clothes washer</i18n.Translate>
                  </Body2>
                  <Select
                    name="equalsAppliancesWasher"
                    options={Object.values(AmenityAccess).map(access => ({
                      text: amenityAccessToText(access),
                      value: access,
                    }))}
                    placeholder={i18n.translate`select`}
                  >
                    {option => <Body2>{option.text}</Body2>}
                  </Select>
                  <Body2>
                    <i18n.Translate>Clothes dryer</i18n.Translate>
                  </Body2>
                  <Select
                    name="equalsAppliancesDryer"
                    options={Object.values(AmenityAccess).map(access => ({
                      text: amenityAccessToText(access),
                      value: access,
                    }))}
                    placeholder={i18n.translate`select`}
                  >
                    {option => <Body2>{option.text}</Body2>}
                  </Select>
                  <Body2>
                    <i18n.Translate>Grill</i18n.Translate>
                  </Body2>
                  <Select
                    name="equalsAmenitiesGrill"
                    options={Object.values(AmenityAccess).map(access => ({
                      text: amenityAccessToText(access),
                      value: access,
                    }))}
                    placeholder={i18n.translate`select`}
                  >
                    {option => <Body2>{option.text}</Body2>}
                  </Select>
                  <Body2>
                    <i18n.Translate>Pool</i18n.Translate>
                  </Body2>
                  <Select
                    name="equalsAmenitiesPool"
                    options={Object.values(AmenityAccess).map(access => ({
                      text: amenityAccessToText(access),
                      value: access,
                    }))}
                    placeholder={i18n.translate`select`}
                  >
                    {option => <Body2>{option.text}</Body2>}
                  </Select>
                  <Body2>
                    <i18n.Translate>Gym on premises</i18n.Translate>
                  </Body2>
                  <Switch name="equalsAmenitiesGym" />
                </div>
              </Section>
              <Section title={i18n.translate`utilities`}>
                <div className={styles.col_2_tall}>
                  <Body2>
                    <i18n.Translate>Air conditioning</i18n.Translate>
                  </Body2>
                  <Select
                    name="equalsUtilitiesAirConditioning"
                    options={Object.values(UtilityConfiguration).map(util => ({
                      text: utilityConfigurationToText(util),
                      value: util,
                    }))}
                    placeholder={i18n.translate`select`}
                  >
                    {option => <Body2>{option.text}</Body2>}
                  </Select>
                  <Body2>
                    <i18n.Translate>Heating</i18n.Translate>
                  </Body2>
                  <Select
                    name="equalsUtilitiesHeating"
                    options={Object.values(UtilityConfiguration).map(util => ({
                      text: utilityConfigurationToText(util),
                      value: util,
                    }))}
                    placeholder={i18n.translate`select`}
                  >
                    {option => <Body2>{option.text}</Body2>}
                  </Select>
                  <Body2>
                    <i18n.Translate>Water filters</i18n.Translate>
                  </Body2>
                  <Select
                    name="equalsUtilitiesWaterFilter"
                    options={Object.values(UtilityWaterFilter).map(filter => ({
                      text: utilityWaterFilterToText(filter),
                      value: filter,
                    }))}
                    placeholder={i18n.translate`select`}
                  >
                    {option => <Body2>{option.text}</Body2>}
                  </Select>
                  <Body2>
                    <i18n.Translate>Gas</i18n.Translate>
                  </Body2>
                  <Select
                    name="equalsUtilitiesGasType"
                    options={Object.values(UtilityGasType).map(gas => ({
                      text: utilityGasTypeToText(gas),
                      value: gas,
                    }))}
                    placeholder={i18n.translate`select`}
                  >
                    {option => <Body2>{option.text}</Body2>}
                  </Select>
                </div>
              </Section>
            </div>
          </DomContainerProvider>
        </div>
        <Footer />
      </Form>
    </div>
  );
});

export const Filters = memo(function Filters() {
  return (
    <BottomSheet id={SHEET_ID}>
      <_Filters />
    </BottomSheet>
  );
});
