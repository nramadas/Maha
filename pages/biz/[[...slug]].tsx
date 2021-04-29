import React from 'react';
import { useQuery } from 'urql';

import { Members } from '@/components/biz/Members';
import { Workspace } from '@/components/chrome/Workspace';
import { breadcrumbsFromPages } from '@/lib/breadcrumbsFromPages';
import { OrganizationPageType } from '@/models/OrganizationPageType';

const pages = `
  query {
    me {
      organization {
        id
        name
        pages {
          type,
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

function pageComponent(breadcrumbs: ReturnType<typeof breadcrumbsFromPages>) {
  const crumb = breadcrumbs[breadcrumbs.length - 1];

  switch (crumb.type) {
    case OrganizationPageType.Members:
      return Members;
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
      {PageComponent && <PageComponent />}
    </Workspace>
  );
}
