import { toName } from '@/lib/organizationPageType/toName';
import { OrganizationPage } from '@/models/OrganizationPage';
import { OrganizationPageType } from '@/models/OrganizationPageType';

export interface Breadcrumb {
  name: ReturnType<typeof toName>;
  type: OrganizationPageType;
  url: string;
}

export function breadcrumbsFromPages(
  pages: OrganizationPage[],
  pathParts: string[],
  level = 1,
): Breadcrumb[] {
  const path = pathParts.slice(0, level).join('/');

  for (const page of pages) {
    if (page.url === '/' + path) {
      const crumbs = [
        {
          type: page.type,
          name: toName(page.type),
          url: page.url,
        },
      ];

      return page.children
        ? crumbs.concat(
            breadcrumbsFromPages(page.children, pathParts, level + 1),
          )
        : crumbs;
    }
  }

  return [];
}
