import { gql } from '@urql/core';
import isNil from 'lodash/isNil';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMutation } from 'urql';

import { Filled } from '@/components/controls/buttons/Filled';
import { Hollow } from '@/components/controls/buttons/Hollow';
import { Form } from '@/components/controls/Form';
import { H6 } from '@/components/typography/H6';
import type { CreateProperty as CreatePropertyInput } from '@/graphql/types/CreateProperty';
import { useDisplayError } from '@/hooks/useDisplayNotification';
import { BizRoute, fullBizRoute } from '@/lib/route';
import { i18n } from '@/lib/translate';

import { Amenities } from './Amenities';
import { Basic } from './Basic';
import { BedBath } from './BedBath';
import styles from './index.module.scss';
import { Other } from './Other';
import { Parking } from './Parking';
import { Schools } from './Schools';
import { Utilities } from './Utilities';

function canonicalizeForm(formValues: any) {
  const canonicalValues: Partial<CreatePropertyInput> = {};

  Object.keys(formValues).forEach(key => {
    const value = formValues[key];

    if (isNil(value)) {
      return;
    }

    switch (key) {
      case 'amenitiesGrill':
      case 'amenitiesPool':
      case 'appliancesDryer':
      case 'appliancesWasher':
      case 'metropolitan':
      case 'propertyCondition':
      case 'type':
      case 'utilitiesAirConditioning':
      case 'utilitiesGasType':
      case 'utilitiesHeating':
      case 'utilitiesWaterFilter': {
        canonicalValues[key] = value.value;
        break;
      }
      case 'amenitiesGym':
      case 'amenitiesSecurity':
      case 'appliancesDishwasher':
      case 'built':
      case 'fees':
      case 'location':
      case 'name':
      case 'numBathrooms':
      case 'numBathroomsHalf':
      case 'numBedrooms':
      case 'parkingGarage':
      case 'price':
      case 'quantity':
      case 'sqft':
      case 'taxes': {
        canonicalValues[key] = value;
        break;
      }
      case 'constructionMaterials':
      case 'securityFeatures': {
        canonicalValues[key] = {
          en: value,
        };
        break;
      }
      case 'schools': {
        canonicalValues.schoolIds = value.map((school: any) => school.id);
        break;
      }
      case 'parkingCoveredSpaces':
      case 'parkingOpenSpaces': {
        if (formValues.parkingGarage) {
          canonicalValues[key] = value;
        }
        break;
      }
    }
  });

  return canonicalValues;
}

const newProperty = gql`
  mutation($property: CreateProperty!) {
    createProperty(property: $property) {
      id
      properties {
        id
        location {
          address
        }
        media {
          id
          type
        }
        name
      }
    }
  }
`;

interface Props {
  className?: string;
  onComplete?(): void;
}

export function CreateProperty(props: Props) {
  const router = useRouter();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [, createProperty] = useMutation(newProperty);
  const displayError = useDisplayError();

  return (
    <Form
      className={styles.container}
      onChange={formValues => setSubmitDisabled(!formValues.name)}
      onSubmit={formValues =>
        createProperty({ property: canonicalizeForm(formValues) }).then(
          result => {
            if (result.error) {
              displayError(i18n.translate`Could not create a new property`);
            } else {
              props.onComplete?.();
              router.push(fullBizRoute(BizRoute.Properties));
            }
          },
        )
      }
    >
      <header className={styles.header}>
        <H6>
          <i18n.Translate>Create a new property</i18n.Translate>
        </H6>
      </header>
      <Basic />
      <BedBath />
      <Amenities />
      <Utilities />
      <Schools />
      <Parking />
      <Other />
      <footer className={styles.footer}>
        <Hollow
          onClick={e => {
            e.preventDefault();
            router.back();
          }}
        >
          <i18n.Translate>Cancel</i18n.Translate>
        </Hollow>
        <Filled disabled={submitDisabled}>
          <i18n.Translate>Submit</i18n.Translate>
        </Filled>
      </footer>
    </Form>
  );
}
