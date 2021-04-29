import { Field, ObjectType } from 'type-graphql';

import { OrganizationPageType } from '@/graphql/types/OrganizationPageType';
import { OrganizationPage as OrganizationPageModel } from '@/models/OrganizationPage';
import { OrganizationPageType as OrganizationPageTypeModel } from '@/models/OrganizationPageType';

@ObjectType({
  description: "An organization's page, intended for members only",
})
export class OrganizationPage implements OrganizationPageModel {
  @Field(type => OrganizationPageType, { description: 'The type of the page' })
  type!: OrganizationPageTypeModel;

  @Field({ description: 'Url that links to this page' })
  url!: string;

  @Field(type => [OrganizationPage], {
    description: 'Nested pages',
    nullable: true,
  })
  children!: OrganizationPageModel[];
}
