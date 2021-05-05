import React from 'react';

import { AddressAutocomplete } from '@/components/controls/AddressAutocomplete';
import { Datepicker } from '@/components/controls/Datepicker';
import { InputWithValidation } from '@/components/controls/InputWithValidation';
import { Number } from '@/components/controls/Number';
import { Price } from '@/components/controls/Price';
import { Select } from '@/components/controls/Select';
import { House } from '@/components/icons/House';
import { Pencil } from '@/components/icons/Pencil';
import { Body2 } from '@/components/typography/Body2';
import { Overline } from '@/components/typography/Overline';
import { patch, today } from '@/lib/date';
import { enumToText as propertyTypeToText } from '@/lib/enumToText/propertyType';
import { i18n } from '@/lib/translate';
import { PropertyType } from '@/models/PropertyType';

import styles from './index.module.scss';

export function Basic() {
  return (
    <>
      <p>
        <Overline>
          <i18n.Translate>Basic information</i18n.Translate>
        </Overline>
      </p>
      <InputWithValidation
        className={styles.name}
        icon={<Pencil />}
        name="name"
        label={i18n.translate`name`}
        onValidate={text =>
          !text ? i18n.translate`You must provide a name` : ''
        }
      />

      <AddressAutocomplete
        requireLatLng
        className={styles.name}
        name="location"
      />

      <div className={styles.threeCol}>
        <Price name="price" label={i18n.translate`price`} />
        <Price name="taxes" label={i18n.translate`approx. yearly tax`} />
        <Price name="fees" label={i18n.translate`monthly fees`} />
      </div>

      <div className={styles.twoCol}>
        <Number icon={<House />} name="sqft" label={i18n.translate`sqft`} />
        <Datepicker
          minDate={patch(today(), { year: -10 })}
          name="built"
          label={i18n.translate`Date built`}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.label}>
          <Body2>
            <i18n.Translate>Property Type:</i18n.Translate>
          </Body2>
        </div>
        <Select
          name="type"
          options={Object.values(PropertyType).map(type => ({
            text: propertyTypeToText(type),
            value: type,
          }))}
          placeholder={i18n.translate`select`}
        >
          {option => <Body2>{option.text}</Body2>}
        </Select>
      </div>
    </>
  );
}
