import { Media } from '@/models/Media';
import { Property } from '@/models/Property';
import { School } from '@/models/School';

export type MapPropertyModel = Pick<
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
  | 'location'
  | 'name'
  | 'numBathrooms'
  | 'numBathroomsHalf'
  | 'numBedrooms'
  | 'parkingCoveredSpaces'
  | 'parkingGarage'
  | 'parkingOpenSpaces'
  | 'price'
  | 'propertyCondition'
  | 'sqft'
  | 'taxes'
  | 'type'
  | 'utilitiesAirConditioning'
  | 'utilitiesGasType'
  | 'utilitiesHeating'
  | 'utilitiesWaterFilter'
> & {
  media: Pick<Media, 'src'>[];
  organizationName: string;
  schools: Pick<School, 'id' | 'location'>[];
};
