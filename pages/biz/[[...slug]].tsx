import { gql } from '@urql/core';
import React from 'react';
import { useQuery } from 'urql';

import { Members } from '@/components/biz/pages/Members';
import { Roles } from '@/components/biz/pages/Roles';
import { CreateProperty } from '@/components/biz/widgets/CreateProperty';
import { Workspace } from '@/components/chrome/Workspace';
import { Breadcrumb, breadcrumbsFromPages } from '@/lib/breadcrumbsFromPages';
import { OrganizationPageType } from '@/models/OrganizationPageType';

const pages = gql`
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

function pageComponent(breadcrumbs: Breadcrumb[]) {
  const lastCrumb = breadcrumbs[breadcrumbs.length - 1];

  switch (lastCrumb.type) {
    case OrganizationPageType.Members:
      return Members;
    case OrganizationPageType.Roles:
      return Roles;
    case OrganizationPageType.AddProperty:
      return CreateProperty;
    default:
      return null;
  }
}

interface Props {
  query: {
    slug: OrganizationPageType[];
  };
}

export default function Biz(props: Props) {
  const slug = props.query.slug || [];
  const [results] = useQuery({ query: pages });

  if (!results.data?.me?.organization) {
    return <div />;
  }

  const permissions = results.data?.me.permissions || [];
  const organization = results.data?.me.organization;
  const breadcrumbs = breadcrumbsFromPages(organization.pages, slug);
  const PageComponent = pageComponent(breadcrumbs);

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
