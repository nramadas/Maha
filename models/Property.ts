import { NominalID } from '@/lib/typeHelpers/nominal';
import { AmenityAccess } from '@/models/AmenityAccess';
import { LocalizedStrings } from '@/models/LocalizedStrings';
import { Location } from '@/models/Location';
import { Metropolitan } from '@/models/Metropolitan';
import type { OrganizationId } from '@/models/Organization';
import { PropertyCondition } from '@/models/PropertyCondition';
import { PropertyType } from '@/models/PropertyType';
import { UtilityConfiguration } from '@/models/UtilityConfiguration';
import { UtilityGasType } from '@/models/UtilityGasType';
import { UtilityWaterFilter } from '@/models/UtilityWaterFilter';

export interface Data {
  amenitiesGrill: AmenityAccess;
  amenitiesGym: boolean;
  amenitiesPool: AmenityAccess;
  amenitiesSecurity: boolean;
  appliancesDishwasher: boolean;
  appliancesDryer: AmenityAccess;
  appliancesWasher: AmenityAccess;
  built?: Date;
  constructionMaterials?: LocalizedStrings;
  fees: number;
  location: Location;
  metropolitan?: Metropolitan;
  name: string;
  numBathrooms: number;
  numBathroomsHalf: number;
  numBedrooms: number;
  parkingCoveredSpaces: number;
  parkingGarage: boolean;
  parkingOpenSpaces: number;
  price: number;
  propertyCondition: PropertyCondition;
  quantity?: number;
  securityFeatures?: LocalizedStrings;
  sqft: number;
  taxes: number;
  type: PropertyType;
  utilitiesAirConditioning: UtilityConfiguration;
  utilitiesGasType: UtilityGasType;
  utilitiesHeating: UtilityConfiguration;
  utilitiesWaterFilter: UtilityWaterFilter;
}

export const DEFAULT_DATA: Data = {
  amenitiesGrill: AmenityAccess.None,
  amenitiesGym: false,
  amenitiesPool: AmenityAccess.None,
  amenitiesSecurity: false,
  appliancesDishwasher: false,
  appliancesDryer: AmenityAccess.None,
  appliancesWasher: AmenityAccess.None,
  fees: 0,
  location: { address: '' },
  name: '',
  numBathrooms: 0,
  numBathroomsHalf: 0,
  numBedrooms: 0,
  parkingCoveredSpaces: 0,
  parkingGarage: false,
  parkingOpenSpaces: 0,
  price: 0,
  propertyCondition: PropertyCondition.New,
  sqft: 0,
  taxes: 0,
  type: PropertyType.Flat,
  utilitiesAirConditioning: UtilityConfiguration.PerRoom,
  utilitiesGasType: UtilityGasType.Canister,
  utilitiesHeating: UtilityConfiguration.PerRoom,
  utilitiesWaterFilter: UtilityWaterFilter.NoFilter,
};

export interface Property extends Data {
  id: NominalID<'property id'>;
  created: Date;
  organizationId: OrganizationId;
}

export type PropertyId = Property['id'];
