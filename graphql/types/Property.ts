import { NominalID } from 'lib/typeHelpers/nominal';
import { Field, ObjectType, ID } from 'type-graphql';

import { AmenityAccess } from '@/graphql/types/AmenityAccess';
import { Place } from '@/graphql/types/Place';
import { PropertyCondition } from '@/graphql/types/PropertyCondition';
import { PropertyType } from '@/graphql/types/PropertyType';
import { UtilityConfiguration } from '@/graphql/types/UtilityConfiguration';
import { UtilityGasType } from '@/graphql/types/UtilityGasType';
import { UtilityWaterFilter } from '@/graphql/types/UtilityWaterFilter';
import { AmenityAccess as AmenityAccessModel } from '@/models/AmenityAccess';
import { Language as LanguageModel } from '@/models/Language';
import { Media as MediaModel } from '@/models/Media';
import { Organization as OrganizationModel } from '@/models/Organization';
import { Place as PlaceModel } from '@/models/Place';
import { Property as PropertyModel } from '@/models/Property';
import { PropertyCondition as PropertyConditionModel } from '@/models/PropertyCondition';
import { PropertyType as PropertyTypeModel } from '@/models/PropertyType';
import { School as SchoolModel } from '@/models/School';
import { UtilityConfiguration as UtilityConfigurationModel } from '@/models/UtilityConfiguration';
import { UtilityGasType as UtilityGasTypeModel } from '@/models/UtilityGasType';
import { UtilityWaterFilter as UtilityWaterFilterModel } from '@/models/UtilityWaterFilter';

@ObjectType({ description: 'A property' })
export class Property implements PropertyModel {
  @Field(type => AmenityAccess, { description: 'Is there access to a grill?' })
  amenitiesGrill!: AmenityAccessModel;

  @Field({ description: 'Is there gym access?' })
  amenitiesGym!: boolean;

  @Field(type => AmenityAccess, { description: 'Is there access to a pool?' })
  amenitiesPool!: AmenityAccessModel;

  @Field({ description: 'Is there security on site?' })
  amenitiesSecurity!: boolean;

  @Field({ description: 'Is there an in-unit dishwasher?' })
  appliancesDishwasher!: boolean;

  @Field(type => AmenityAccess, {
    description: 'Is there access to a clothes dryer?',
  })
  appliancesDryer!: AmenityAccessModel;

  @Field(type => AmenityAccess, {
    description: 'Is there access to a clothes washer?',
  })
  appliancesWasher!: AmenityAccessModel;

  @Field({
    description: 'Materials used to build the property, organized by language',
  })
  constructionMaterials!: Partial<Record<LanguageModel, string>>;

  @Field({ description: 'Monthly fees' })
  fees!: number;

  @Field(type => ID, { description: "The property's id" })
  id!: NominalID<'property id'>;

  @Field(type => Place, { description: 'Where the property is located' })
  location!: PlaceModel;

  @Field(type => [ID], { description: 'List of associated media ids' })
  mediaIds!: MediaModel['id'][];

  @Field({ description: 'How many bathrooms are in the property' })
  numBathrooms!: number;

  @Field({ description: 'How many half bathrooms are in the property' })
  numBathroomsHalf!: number;

  @Field({ description: 'How many bedrooms are in the property' })
  numBedrooms!: number;

  @Field(type => ID, { description: 'Which organization own this property' })
  organization!: OrganizationModel['id'];

  @Field({
    description:
      'How many covered parking spaces are associated with this property',
  })
  parkingCoveredSpaces!: number;

  @Field({ description: 'Is there a parking garage on the premises?' })
  parkingGarage!: boolean;

  @Field({
    description:
      'How many open parking spaces are associated with this property',
  })
  parkingOpenSpaces!: number;

  @Field({ description: 'How much the property costs' })
  price!: number;

  @Field(type => PropertyCondition, {
    description: 'Whether the property is new or used',
  })
  propertyCondition!: PropertyConditionModel;

  @Field(type => [ID], { description: 'Ids of matriculation schools nearby' })
  schoolsMatriculationIds!: SchoolModel['id'][];

  @Field(type => [ID], { description: 'Ids of pre-primary schools nearby' })
  schoolsPrePrimaryIds!: SchoolModel['id'][];

  @Field(type => [ID], { description: 'Ids of primary schools nearby' })
  schoolsPrimaryIds!: SchoolModel['id'][];

  @Field(type => [ID], { description: 'Ids of secondary schools nearby' })
  schoolsSecondaryIds!: SchoolModel['id'][];

  @Field(type => [ID], {
    description: 'Ids of senior secondary schools nearby',
  })
  schoolsSeniorSecondaryIds!: SchoolModel['id'][];

  @Field({
    description:
      'Security features available on premises, organized by language',
  })
  securityFeatures!: Partial<Record<LanguageModel, string>>;

  @Field({ description: 'The size of the property' })
  sqft!: number;

  @Field({ description: 'Approximate yearly tax rate' })
  taxes!: number;

  @Field(type => PropertyType, { description: 'What type of property it is' })
  type!: PropertyTypeModel;

  @Field(type => UtilityConfiguration, {
    description: 'Is the air conditioning central or built into each room?',
  })
  utilitiesAirConditioning!: UtilityConfigurationModel;

  @Field(type => UtilityGasType, {
    description: 'Is the cooking gas integrated or devlivered via canisters?',
  })
  utilitiesGasType!: UtilityGasTypeModel;

  @Field(type => UtilityConfiguration, {
    description: 'Is the heating central or built into each room?',
  })
  utilitiesHeating!: UtilityConfigurationModel;

  @Field(type => UtilityWaterFilter, {
    description: 'How the water filtertration is configured',
  })
  utilitiesWaterFilter!: UtilityWaterFilterModel;

  @Field({ description: 'What year the property was built' })
  yearBuilt!: number;
}
