import { ID, Field, InputType } from 'type-graphql';

import { AmenityAccess } from '@/graphql/types/AmenityAccess';
import { CreateLocalizedStrings } from '@/graphql/types/CreateLocalizedStrings';
import { CreateLocation } from '@/graphql/types/CreateLocation';
import { Media } from '@/graphql/types/Media';
import { PropertyCondition } from '@/graphql/types/PropertyCondition';
import { PropertyType } from '@/graphql/types/PropertyType';
import { School } from '@/graphql/types/School';
import { UtilityConfiguration } from '@/graphql/types/UtilityConfiguration';
import { UtilityGasType } from '@/graphql/types/UtilityGasType';
import { UtilityWaterFilter } from '@/graphql/types/UtilityWaterFilter';

@InputType({ description: 'Fields needed to create a property' })
export class CreateProperty {
  @Field({
    description: 'Is there access to a grill?',
    nullable: true,
  })
  amenitiesGrill?: AmenityAccess;

  @Field({
    description: 'Is there gym access?',
    nullable: true,
  })
  amenitiesGym?: boolean;

  @Field({
    description: 'Is there access to a pool?',
    nullable: true,
  })
  amenitiesPool?: AmenityAccess;

  @Field({
    description: 'Is there security on site?',
    nullable: true,
  })
  amenitiesSecurity?: boolean;

  @Field({
    description: 'Is there an in-unit dishwasher?',
    nullable: true,
  })
  appliancesDishwasher?: boolean;

  @Field({
    description: 'Is there access to a clothes dryer?',
    nullable: true,
  })
  appliancesDryer?: AmenityAccess;

  @Field({
    description: 'Is there access to a clothes washer?',
    nullable: true,
  })
  appliancesWasher?: AmenityAccess;

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
  constructionMaterials?: CreateLocalizedStrings;

  @Field({
    description: 'Monthly fees',
    nullable: true,
  })
  fees?: number;

  @Field({
    description: 'Where the property is located',
    nullable: true,
  })
  location?: CreateLocation;

  @Field(type => [ID], {
    description: 'List of associated media ids',
    nullable: true,
  })
  mediaIds?: Media['id'][];

  @Field({
    description: "The property's name, if any",
  })
  name!: string;

  @Field({
    description: 'How many bathrooms are in the property',
    nullable: true,
  })
  numBathrooms?: number;

  @Field({
    description: 'How many half bathrooms are in the property',
    nullable: true,
  })
  numBathroomsHalf?: number;

  @Field({
    description: 'How many bedrooms are in the property',
    nullable: true,
  })
  numBedrooms?: number;

  @Field({
    description:
      'How many covered parking spaces are associated with this property',
    nullable: true,
  })
  parkingCoveredSpaces?: number;

  @Field({
    description: 'Is there included parking?',
    nullable: true,
  })
  parkingGarage?: boolean;

  @Field({
    description:
      'How many open parking spaces are associated with this property',
    nullable: true,
  })
  parkingOpenSpaces?: number;

  @Field({
    description: 'How much the property costs',
    nullable: true,
  })
  price?: number;

  @Field({
    description: 'Whether the property is new or used',
    nullable: true,
  })
  propertyCondition?: PropertyCondition;

  @Field(type => [ID], {
    description: 'Ids of schools nearby',
    nullable: true,
  })
  schoolIds?: School['id'][];

  @Field({
    description:
      'Security features available on premises, organized by language',
    nullable: true,
  })
  securityFeatures?: CreateLocalizedStrings;

  @Field({
    description: 'The size of the property',
    nullable: true,
  })
  sqft?: number;

  @Field({
    description: 'Approximate yearly tax rate',
    nullable: true,
  })
  taxes?: number;

  @Field({
    description: 'What type of property it is',
    nullable: true,
  })
  type?: PropertyType;

  @Field({
    description: 'Is the air conditioning central or built into each room?',
    nullable: true,
  })
  utilitiesAirConditioning?: UtilityConfiguration;

  @Field({
    description: 'Is the cooking gas integrated or devlivered via canisters?',
    nullable: true,
  })
  utilitiesGasType?: UtilityGasType;

  @Field({
    description: 'Is the heating central or built into each room?',
    nullable: true,
  })
  utilitiesHeating?: UtilityConfiguration;

  @Field({
    description: 'How the water filtertration is configured',
    nullable: true,
  })
  utilitiesWaterFilter?: UtilityWaterFilter;
}
