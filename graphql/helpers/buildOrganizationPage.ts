import { BizRoute } from '@/lib/route';
import { OrganizationPage } from '@/models/OrganizationPage';
import { OrganizationPageType } from '@/models/OrganizationPageType';
import { Permission } from '@/models/Permission';

export function buildOrganizationPage(permissions: Permission[]) {
  const pages: OrganizationPage[] = [];
  const permSet = new Set(permissions);

  // Overview
  pages.push({
    type: OrganizationPageType.Overview,
    url: BizRoute.Overview,
  });

  if (
    permSet.has(Permission.ViewProperties) ||
    permSet.has(Permission.ManageProperties)
  ) {
    const propertyPage: OrganizationPage = {
      type: OrganizationPageType.Properties,
      url: BizRoute.Properties,
    };

    if (permSet.has(Permission.ManageProperties)) {
      propertyPage.children = [
        {
          type: OrganizationPageType.AddProperty,
          url: BizRoute.AddProperty,
        },
      ];
    }

    pages.push(propertyPage);
  }

  // Members, Roles
  if (
    permSet.has(Permission.ViewMembers) ||
    permSet.has(Permission.ManageMembers)
  ) {
    const memberPage: OrganizationPage = {
      type: OrganizationPageType.Members,
      url: BizRoute.Members,
    };

    if (permSet.has(Permission.ModifyRoles)) {
      memberPage.children = [
        {
          type: OrganizationPageType.Roles,
          url: BizRoute.Roles,
        },
      ];
    }

    pages.push(memberPage);
  }

  // Sales (Leads, Visits, Reservations, Closures)
  if (
    permSet.has(Permission.ViewSales) ||
    permSet.has(Permission.ManageSales)
  ) {
    const salesPage: OrganizationPage = {
      type: OrganizationPageType.Sales,
      url: BizRoute.Sales,
      children: [
        {
          type: OrganizationPageType.SalesLeads,
          url: BizRoute.SalesLeads,
        },
        {
          type: OrganizationPageType.SalesVisits,
          url: BizRoute.SalesVisits,
        },
        {
          type: OrganizationPageType.SalesReservations,
          url: BizRoute.SalesReservations,
        },
        {
          type: OrganizationPageType.SalesClosures,
          url: BizRoute.SalesClosures,
        },
      ],
    };

    pages.push(salesPage);
  }

  // Insights
  if (permSet.has(Permission.ViewInsights)) {
    const insightsPage: OrganizationPage = {
      type: OrganizationPageType.Insights,
      url: BizRoute.Insights,
    };

    pages.push(insightsPage);
  }

  return pages;
}
