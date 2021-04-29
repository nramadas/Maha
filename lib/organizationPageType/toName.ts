import { i18n } from '@/lib/translate';
import { OrganizationPageType } from '@/models/OrganizationPageType';

export function toName(
  pageType: OrganizationPageType,
): ReturnType<typeof i18n.translate> {
  switch (pageType) {
    case OrganizationPageType.Insights:
      return i18n.translate`insights`;
    case OrganizationPageType.Members:
      return i18n.translate`members`;
    case OrganizationPageType.Overview:
      return i18n.translate`overview`;
    case OrganizationPageType.Properties:
      return i18n.translate`properties`;
    case OrganizationPageType.Roles:
      return i18n.translate`roles`;
    case OrganizationPageType.Sales:
      return i18n.translate`sales`;
    case OrganizationPageType.SalesClosures:
      return i18n.translate`closures`;
    case OrganizationPageType.SalesLeads:
      return i18n.translate`leads`;
    case OrganizationPageType.SalesReservations:
      return i18n.translate`reservations`;
    case OrganizationPageType.SalesVisits:
      return i18n.translate`visitations`;
  }
}
