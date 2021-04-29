import { DollarRupee } from '@/components/icons/DollarRupee';
import { Lightbulb } from '@/components/icons/Lightbulb';
import { Overview } from '@/components/icons/Overview';
import { People } from '@/components/icons/People';
import { Properties } from '@/components/icons/Properties';
import { OrganizationPageType } from '@/models/OrganizationPageType';

export function toIcon(pageType: OrganizationPageType) {
  switch (pageType) {
    case OrganizationPageType.Insights:
      return Lightbulb;
    case OrganizationPageType.Members:
      return People;
    case OrganizationPageType.Overview:
      return Overview;
    case OrganizationPageType.Properties:
      return Properties;
    case OrganizationPageType.Sales:
      return DollarRupee;
    default:
      return null;
  }
}
