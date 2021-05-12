import isNil from 'lodash/isNil';

import type { CreateProperty as CreatePropertyInput } from '@/graphql/types/CreateProperty';

export function formToCreateProperty(formValues: any) {
  const canonicalValues: Partial<CreatePropertyInput> = {};

  Object.keys(formValues).forEach(key => {
    const value = formValues[key];

    if (isNil(value)) {
      return;
    }

    switch (key) {
      case 'amenitiesGrill':
      case 'amenitiesGym':
      case 'amenitiesPool':
      case 'amenitiesSecurity':
      case 'appliancesDishwasher':
      case 'appliancesDryer':
      case 'appliancesWasher':
      case 'metropolitanKey':
      case 'propertyCondition':
      case 'type':
      case 'utilitiesAirConditioning':
      case 'utilitiesGasType':
      case 'utilitiesHeating':
      case 'utilitiesWaterFilter': {
        canonicalValues[key] = value.value;
        break;
      }
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
      case 'media': {
        canonicalValues.mediaIds = value.map((m: any) => m.id);
        break;
      }
    }
  });

  return canonicalValues;
}
