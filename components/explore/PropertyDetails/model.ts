import { Location } from '@/models/Location';
import { Media } from '@/models/Media';
import { Property } from '@/models/Property';
import { School } from '@/models/School';

export type PropertyDetailsModel = Pick<
  Property,
  | 'amenitiesGrill'
  | 'amenitiesGym'
  | 'amenitiesPool'
  | 'amenitiesSecurity'
  | 'appliancesDishwasher'
  | 'appliancesDryer'
  | 'appliancesWasher'
  | 'built'
  | 'constructionMaterials'
  | 'fees'
  | 'id'
  | 'name'
  | 'numBathrooms'
  | 'numBathroomsHalf'
  | 'numBedrooms'
  | 'parkingCoveredSpaces'
  | 'parkingGarage'
  | 'parkingOpenSpaces'
  | 'price'
  | 'propertyCondition'
  | 'quantity'
  | 'securityFeatures'
  | 'sqft'
  | 'taxes'
  | 'type'
  | 'utilitiesAirConditioning'
  | 'utilitiesGasType'
  | 'utilitiesHeating'
  | 'utilitiesWaterFilter'
> & {
  location: Pick<Location, 'address' | 'lat' | 'lng'>;
  media: Pick<Media, 'id' | 'src' | 'type'>[];
  organizationName: string;
  schools: (Pick<School, 'id' | 'name' | 'type'> & {
    location: Pick<Location, 'address' | 'lat' | 'lng'>;
  })[];
};
