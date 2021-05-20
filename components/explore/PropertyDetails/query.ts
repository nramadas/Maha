import { gql } from '@urql/core';

export const propertyQuery = gql`
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
        src
        type
      }
      name
      numBathrooms
      numBathroomsHalf
      numBedrooms
      organizationName
      parkingCoveredSpaces
      parkingGarage
      parkingOpenSpaces
      price
      propertyCondition
      quantity
      schools {
        id
        name
        location {
          address
          lat
          lng
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
