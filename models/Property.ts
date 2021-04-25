import { NominalID } from '@/lib/typeHelpers/nominal';
import { AmenityAccess } from '@/models/AmenityAccess';
import { Language } from '@/models/Language';
import { Media } from '@/models/Media';
import type { OrganizationId } from '@/models/Organization';
import { Place } from '@/models/Place';
import { PropertyCondition } from '@/models/PropertyCondition';
import { PropertyType } from '@/models/PropertyType';
import { School } from '@/models/School';
import { UtilityConfiguration } from '@/models/UtilityConfiguration';
import { UtilityGasType } from '@/models/UtilityGasType';
import { UtilityWaterFilter } from '@/models/UtilityWaterFilter';

export interface Data {
  price: number;
  sqft: number;
  numBedrooms: number;
  numBathrooms: number;
  numBathroomsHalf: number;
  location: Place;
  taxes: number;
  fees: number;
  type: PropertyType;
  yearBuilt: number;
  parkingCoveredSpaces: number;
  parkingOpenSpaces: number;
  parkingGarage: boolean;
  schoolsPrePrimaryIds: School['id'][];
  schoolsPrimaryIds: School['id'][];
  schoolsSecondaryIds: School['id'][];
  schoolsMatriculationIds: School['id'][];
  schoolsSeniorSecondaryIds: School['id'][];
  constructionMaterials: Partial<Record<Language, string>>;
  propertyCondition: PropertyCondition;
  securityFeatures: Partial<Record<Language, string>>;
  utilitiesAirConditioning: UtilityConfiguration;
  utilitiesHeating: UtilityConfiguration;
  utilitiesGasType: UtilityGasType;
  utilitiesWaterFilter: UtilityWaterFilter;
  amenitiesPool: AmenityAccess;
  amenitiesGym: boolean;
  amenitiesSecurity: boolean;
  amenitiesGrill: AmenityAccess;
  appliancesDryer: AmenityAccess;
  appliancesWasher: AmenityAccess;
  appliancesDishwasher: boolean;
  mediaIds: Media['id'][];
}

export const DEFAULT_DATA: Data = {
  price: 0,
  sqft: 0,
  numBedrooms: 0,
  numBathrooms: 0,
  numBathroomsHalf: 0,
  location: {
    address: '',
  },
  taxes: 0,
  fees: 0,
  type: PropertyType.Flat,
  yearBuilt: 0,
  parkingCoveredSpaces: 0,
  parkingOpenSpaces: 0,
  parkingGarage: false,
  schoolsPrePrimaryIds: [],
  schoolsPrimaryIds: [],
  schoolsSecondaryIds: [],
  schoolsMatriculationIds: [],
  schoolsSeniorSecondaryIds: [],
  constructionMaterials: {},
  propertyCondition: PropertyCondition.New,
  securityFeatures: {},
  utilitiesAirConditioning: UtilityConfiguration.PerRoom,
  utilitiesHeating: UtilityConfiguration.PerRoom,
  utilitiesGasType: UtilityGasType.Canister,
  utilitiesWaterFilter: UtilityWaterFilter.NoFilter,
  amenitiesPool: AmenityAccess.None,
  amenitiesGym: false,
  amenitiesSecurity: false,
  amenitiesGrill: AmenityAccess.None,
  appliancesDryer: AmenityAccess.None,
  appliancesWasher: AmenityAccess.None,
  appliancesDishwasher: false,
  mediaIds: [],
};

export interface Property extends Data {
  id: NominalID<'property id'>;
  organization: OrganizationId;
}

export type PropertyId = Property['id'];
