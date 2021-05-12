import { registerEnumType } from 'type-graphql';

import { OrganizationPageType } from '@/models/OrganizationPageType';

registerEnumType(OrganizationPageType, {
  name: 'OrganizationPageType',
  description: "For the organization's workspace, all the potential page types",
  valuesConfig: {
    AddProperty: {
      description: 'Add a new property',
    },
    DynamicRoute: {
      description: 'A page that gets its value from the url',
    },
    EditProperty: {
      description: 'Edit a property',
    },
    Insights: {
      description: 'Data graphs and other insights',
    },
    Members: {
      description: 'View, add, and remove members; assign roles to members',
    },
    Overview: {
      description: 'An overview of the organization',
    },
    Properties: {
      description: 'View and remove properties',
    },
    Roles: {
      description: 'Add, remove, and modify roles',
    },
    Sales: {
      description: 'Sales workflow',
    },
    SalesLeads: {
      description: 'Sales leads',
    },
    SalesVisits: {
      description: 'Scheduled on-sites',
    },
    SalesReservations: {
      description: 'Downpayments',
    },
    SalesClosures: {
      description: 'Completed sales',
    },
  },
});

export { OrganizationPageType };
