import { gql } from '@urql/core';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation, useQuery } from 'urql';

import { PropertyForm } from '@/components/biz/widgets/PropertyForm';
import { propertyToForm } from '@/components/biz/widgets/PropertyForm/propertyToForm';
import { H6 } from '@/components/typography/H6';
import { useDisplayError } from '@/hooks/useDisplayNotification';
import { BizRoute, fullBizRoute } from '@/lib/route';
import { i18n } from '@/lib/translate';
import { Property } from '@/models/Property';

import styles from './index.module.scss';

const editPropertyMutation = gql`
  mutation($property: EditProperty!) {
    editProperty(property: $property) {
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
`;

const propertyQuery = gql`
  query($id: ID!) {
    propertyById(id: $id) {
      amenitiesGrill
      amenitiesGym
      amenitiesPool
      amenitiesSecurity
      appliancesDishwasher
      appliancesDryer
      appliancesWasher
      built
      constructionMaterials {
        en
      }
      fees
      id
      location {
        address
        lat
        lng
      }
      media {
        id
        parentId
        parentType
        src
        type
      }
      metropolitanKey
      name
      numBathrooms
      numBathroomsHalf
      numBedrooms
      organizationId
      parkingCoveredSpaces
      parkingGarage
      parkingOpenSpaces
      price
      propertyCondition
      quantity
      schools {
        id
        googleId
        name
        location {
          address
        }
        type
      }
      securityFeatures {
        en
      }
      sqft
      taxes
      type
      utilitiesAirConditioning
      utilitiesGasType
      utilitiesHeating
      utilitiesWaterFilter
    }
  }
`;

interface Props {
  propertyId: Property['id'];
}

export function EditProperty(props: Props) {
  const displayError = useDisplayError();
  const [editPropertyResult, editProperty] = useMutation(editPropertyMutation);
  const router = useRouter();

  const [results] = useQuery({
    query: propertyQuery,
    variables: { id: props.propertyId },
  });

  const property = results.data?.propertyById;

  if (!property) {
    return null;
  }

  return (
    <div>
      <header className={styles.header}>
        <H6>
          <i18n.Translate>Edit property</i18n.Translate>
        </H6>
      </header>
      <PropertyForm
        defaultValues={propertyToForm(property)}
        submitting={editPropertyResult.fetching}
        onSubmit={property =>
          editProperty({
            property: { id: props.propertyId, ...property },
          }).then(result => {
            if (result.error) {
              displayError(i18n.translate`Could not edit property`);
            } else {
              router.push(fullBizRoute(BizRoute.Properties));
            }
          })
        }
      />
    </div>
  );
}
