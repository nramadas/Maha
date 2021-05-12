import type { Property } from '@/graphql/types/Property';

function cleanValue(value: any): typeof value {
  if (typeof value === 'object' && '__typename' in value) {
    const { __typename, ...rest } = value;
    return rest;
  }

  if (Array.isArray(value)) {
    return value.map(cleanValue);
  }

  return value;
}

export function propertyToForm(property: Property) {
  const formValues: any = {};

  Object.keys(property).forEach(key => {
    const value = property[key as keyof Property];

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
        formValues[key] = { value };
        break;
      }
      case 'fees':
      case 'location':
      case 'name':
      case 'numBathrooms':
      case 'numBathroomsHalf':
      case 'numBedrooms':
      case 'parkingCoveredSpaces':
      case 'parkingGarage':
      case 'parkingOpenSpaces':
      case 'price':
      case 'quantity':
      case 'sqft':
      case 'taxes': {
        formValues[key] = cleanValue(value);
        break;
      }
      case 'constructionMaterials':
      case 'securityFeatures': {
        // @ts-ignore
        formValues[key] = value?.en;
        break;
      }
      case 'schools': {
        formValues.schools = cleanValue(value);
        break;
      }
      case 'media': {
        formValues.media = cleanValue(value);
        break;
      }
      case 'built': {
        formValues.built = new Date(value as string);
        break;
      }
    }
  });

  return formValues;
}
