import { OrganizationPage } from '@/models/OrganizationPage';
import { OrganizationPageType } from '@/models/OrganizationPageType';
import { Permission } from '@/models/Permission';

export function buildOrganizationPage(permissions: Permission[]) {
  const pages: OrganizationPage[] = [];
  const permSet = new Set(permissions);

  // Overview
  pages.push({
    type: OrganizationPageType.Overview,
    url: '/',
  });

  if (
    permSet.has(Permission.ViewProperties) ||
    permSet.has(Permission.ManageProperties)
  ) {
    const propertyPage: OrganizationPage = {
      type: OrganizationPageType.Properties,
      url: '/properites',
    };

    pages.push(propertyPage);
  }

  // Members, Roles
  if (
    permSet.has(Permission.ViewMembers) ||
    permSet.has(Permission.ManageMembers)
  ) {
    const memberPage: OrganizationPage = {
      type: OrganizationPageType.Members,
      url: '/members',
    };

    if (permSet.has(Permission.ModifyRoles)) {
      memberPage.children = [
        {
          type: OrganizationPageType.Roles,
          url: '/members/roles',
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
      url: '/sales',
      children: [
        {
          type: OrganizationPageType.SalesLeads,
          url: '/sales/leads',
        },
        {
          type: OrganizationPageType.SalesVisits,
          url: '/sales/visits',
        },
        {
          type: OrganizationPageType.SalesReservations,
          url: '/sales/reservations',
        },
        {
          type: OrganizationPageType.SalesClosures,
          url: '/sales/closures',
        },
      ],
    };

    pages.push(salesPage);
  }

  // Insights
  if (permSet.has(Permission.ViewInsights)) {
    const insightsPage: OrganizationPage = {
      type: OrganizationPageType.Insights,
      url: '/insights',
    };

    pages.push(insightsPage);
  }

  return pages;
}
