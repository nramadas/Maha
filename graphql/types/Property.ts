import { Field, ObjectType, ID } from 'type-graphql';

import { AmenityAccess } from '@/graphql/types/AmenityAccess';
import { LocalizedStrings } from '@/graphql/types/LocalizedStrings';
import { Location } from '@/graphql/types/Location';
import { MetropolitanKey } from '@/graphql/types/MetropolitanKey';
import { Organization } from '@/graphql/types/Organization';
import { PropertyCondition } from '@/graphql/types/PropertyCondition';
import { PropertyType } from '@/graphql/types/PropertyType';
import { UtilityConfiguration } from '@/graphql/types/UtilityConfiguration';
import { UtilityGasType } from '@/graphql/types/UtilityGasType';
import { UtilityWaterFilter } from '@/graphql/types/UtilityWaterFilter';
import { Property as PropertyModel } from '@/models/Property';

@ObjectType({ description: 'A property' })
export class Property implements PropertyModel {
  @Field({ description: 'Is there access to a grill?' })
  amenitiesGrill!: AmenityAccess;

  @Field({ description: 'Is there gym access?' })
  amenitiesGym!: boolean;

  @Field({ description: 'Is there access to a pool?' })
  amenitiesPool!: AmenityAccess;

  @Field({ description: 'Is there security on site?' })
  amenitiesSecurity!: boolean;

  @Field({ description: 'Is there an in-unit dishwasher?' })
  appliancesDishwasher!: boolean;

  @Field({
    description: 'Is there access to a clothes dryer?',
  })
  appliancesDryer!: AmenityAccess;

  @Field({
    description: 'Is there access to a clothes washer?',
  })
  appliancesWasher!: AmenityAccess;

  @Field({
    description:
      'The date the property was built. Can be a date in the future if still under construction',
    nullable: true,
  })
  built?: Date;

  @Field({
    description: 'Materials used to build the property, organized by language',
    nullable: true,
  })
  constructionMaterials?: LocalizedStrings;

  @Field({
    description: 'When this property was established in the database',
  })
  created!: Date;

  @Field({ description: 'Monthly fees' })
  fees!: number;

  @Field(type => ID, { description: "The property's id" })
  id!: PropertyModel['id'];

  @Field({ description: 'Where the property is located' })
  location!: Location;

  @Field({
    description: 'Which metropolitan area is the property in',
    nullable: true,
  })
  metropolitanKey?: MetropolitanKey;

  @Field({ description: "The property's name, if any" })
  name!: string;

  @Field({ description: 'How many bathrooms are in the property' })
  numBathrooms!: number;

  @Field({ description: 'How many half bathrooms are in the property' })
  numBathroomsHalf!: number;

  @Field({ description: 'How many bedrooms are in the property' })
  numBedrooms!: number;

  @Field(type => ID, { description: 'Which organization own this property' })
  organizationId!: Organization['id'];

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

  @Field({
    description: 'Whether the property is new or used',
  })
  propertyCondition!: PropertyCondition;

  @Field({
    description: 'How many of this property are available',
    nullable: true,
  })
  quantity?: number;

  @Field({
    description:
      'Security features available on premises, organized by language',
    nullable: true,
  })
  securityFeatures?: LocalizedStrings;

  @Field({ description: 'The size of the property' })
  sqft!: number;

  @Field({ description: 'Approximate yearly tax rate' })
  taxes!: number;

  @Field({ description: 'What type of property it is' })
  type!: PropertyType;

  @Field({
    description: 'Is the air conditioning central or built into each room?',
  })
  utilitiesAirConditioning!: UtilityConfiguration;

  @Field({
    description: 'Is the cooking gas integrated or devlivered via canisters?',
  })
  utilitiesGasType!: UtilityGasType;

  @Field({
    description: 'Is the heating central or built into each room?',
  })
  utilitiesHeating!: UtilityConfiguration;

  @Field({
    description: 'How the water filtertration is configured',
  })
  utilitiesWaterFilter!: UtilityWaterFilter;
}
