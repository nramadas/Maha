import { OrganizationPageType } from '@/models/OrganizationPageType';

export interface OrganizationPage {
  type: OrganizationPageType;
  url: string;
  children?: OrganizationPage[];
}
