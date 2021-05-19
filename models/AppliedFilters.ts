import { AmenityAccess } from '@/models/AmenityAccess';
import { UtilityConfiguration } from '@/models/UtilityConfiguration';
import { UtilityGasType } from '@/models/UtilityGasType';
import { UtilityWaterFilter } from '@/models/UtilityWaterFilter';

export interface AppliedFilters {
  equalsAmenitiesGrill: AmenityAccess | null;
  equalsAmenitiesGym: boolean | null;
  equalsAmenitiesPool: AmenityAccess | null;
  equalsAppliancesDishwasher: boolean | null;
  equalsAppliancesDryer: AmenityAccess | null;
  equalsAppliancesWasher: AmenityAccess | null;
  equalsUtilitiesAirConditioning: UtilityConfiguration | null;
  equalsUtilitiesGasType: UtilityGasType | null;
  equalsUtilitiesHeating: UtilityConfiguration | null;
  equalsUtilitiesWaterFilter: UtilityWaterFilter | null;
  maxFees: number | null;
  maxPrice: number | null;
  maxSqft: number | null;
  maxTaxes: number | null;
  maxYearBuilt: number | null;
  minNumBathrooms: number | null;
  minNumBedrooms: number | null;
  minParkingSpaces: number | null;
  minPrice: number | null;
  minSqft: number | null;
  minYearBuilt: number | null;
}

export const DEFAULT_DATA: AppliedFilters = {
  equalsAmenitiesGrill: null,
  equalsAmenitiesGym: null,
  equalsAmenitiesPool: null,
  equalsAppliancesDishwasher: null,
  equalsAppliancesDryer: null,
  equalsAppliancesWasher: null,
  equalsUtilitiesAirConditioning: null,
  equalsUtilitiesGasType: null,
  equalsUtilitiesHeating: null,
  equalsUtilitiesWaterFilter: null,
  maxFees: null,
  maxPrice: null,
  maxSqft: null,
  maxTaxes: null,
  maxYearBuilt: null,
  minNumBathrooms: null,
  minNumBedrooms: null,
  minParkingSpaces: null,
  minPrice: null,
  minSqft: null,
  minYearBuilt: null,
};
