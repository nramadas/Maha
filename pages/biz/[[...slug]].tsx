import { gql } from '@urql/core';
import React from 'react';
import { useQuery } from 'urql';

import { AddProperty } from '@/components/biz/pages/AddProperty';
import { EditProperty } from '@/components/biz/pages/EditProperty';
import { Members } from '@/components/biz/pages/Members';
import { Overview } from '@/components/biz/pages/Overview';
import { Properties } from '@/components/biz/pages/Properties';
import { Roles } from '@/components/biz/pages/Roles';
import { Workspace } from '@/components/chrome/Workspace';
import { Breadcrumb, breadcrumbsFromPages } from '@/lib/breadcrumbsFromPages';
import { OrganizationPage } from '@/models/OrganizationPage';
import { OrganizationPageType } from '@/models/OrganizationPageType';

const pagesQuery = gql`
  query {
    me {
      id
      permissions
      organization {
        id
        name
        pages {
          type
          url
          children {
            type
            url
          }
        }
      }
    }
  }
`;

const enhancePages = (pages: OrganizationPage[]) =>
  pages.map(page => {
    if (page.type === OrganizationPageType.Properties) {
      const canEdit = !!(page.children || []).find(
        child => child.type === OrganizationPageType.AddProperty,
      );

      if (canEdit) {
        return {
          ...page,
          children: (page.children || []).concat({
            type: OrganizationPageType.EditProperty,
            url: '/properties/edit',
          }),
        };
      }
    }

    return page;
  });

function pageComponent(
  breadcrumbs: Breadcrumb[],
  slug: (OrganizationPageType | string)[],
) {
  const lastCrumb = breadcrumbs[breadcrumbs.length - 1];

  switch (lastCrumb.type) {
    case OrganizationPageType.Members:
      return Members;
    case OrganizationPageType.Roles:
      return Roles;
    case OrganizationPageType.AddProperty:
      return AddProperty;
    case OrganizationPageType.Properties:
      return Properties;
    case OrganizationPageType.Overview:
      return Overview;
    default: {
      const secondToLastCrumb = breadcrumbs[breadcrumbs.length - 2];

      if (!secondToLastCrumb) {
        return null;
      }

      switch (secondToLastCrumb.type) {
        case OrganizationPageType.EditProperty: {
          return () => <EditProperty propertyId={slug[slug.length - 1]} />;
        }
        default:
          return null;
      }
    }
  }
}

interface Props {
  query: {
    slug: (OrganizationPageType | string)[];
  };
}

export default function Biz(props: Props) {
  const slug = props.query.slug || [];
  const [results] = useQuery({ query: pagesQuery });

  if (!results.data?.me?.organization) {
    return <div />;
  }

  const permissions = results.data?.me.permissions || [];
  const organization = results.data?.me.organization;
  const breadcrumbs = breadcrumbsFromPages(
    enhancePages(organization.pages),
    slug,
  );

  const PageComponent = pageComponent(breadcrumbs, slug);

  return (
    <Workspace
      breadcrumbs={breadcrumbs}
      organization={organization}
      pages={organization.pages}
      pathParts={slug}
    >
      {PageComponent && <PageComponent permissions={permissions} />}
    </Workspace>
  );
}
