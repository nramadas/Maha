import cx from 'classnames';
import Link from 'next/link';
import React from 'react';

import { Empty } from '@/components/controls/links/Empty';
import { DollarRupee } from '@/components/icons/DollarRupee';
import { Lightbulb } from '@/components/icons/Lightbulb';
import { Overview } from '@/components/icons/Overview';
import { People } from '@/components/icons/People';
import { Properties } from '@/components/icons/Properties';
import { Wrench } from '@/components/icons/Wrench';
import { useLanguagePack } from '@/hooks/useLanguagePack';
import { i18n } from '@/lib/translate';
import { Organization } from '@/models/Organization';

import styles from './index.module.scss';

export const pageList = (orgId: Organization['id']) =>
  [
    {
      Icon: Overview,
      key: 'overview',
      title: i18n.translate`overview`,
      url: `/organization/${orgId}`,
    },
    {
      Icon: Wrench,
      key: 'setup',
      title: i18n.translate`setup`,
      url: `/organization/${orgId}/setup`,
    },
    {
      Icon: Properties,
      key: 'properties',
      title: i18n.translate`properties`,
      url: `/organization/${orgId}/properties`,
    },
    {
      Icon: People,
      key: 'members',
      title: i18n.translate`members`,
      url: `/organization/${orgId}/members`,
    },
    {
      Icon: DollarRupee,
      key: 'sales',
      title: i18n.translate`sales`,
      url: `/organization/${orgId}/sales`,
    },
    {
      key: 'leads',
      title: i18n.translate`leads`,
      url: `/organization/${orgId}/sales/leads`,
      parent: 'sales',
    },
    {
      key: 'visits',
      title: i18n.translate`visits`,
      url: `/organization/${orgId}/sales/visits`,
      parent: 'sales',
    },
    {
      key: 'reserved',
      title: i18n.translate`reserved`,
      url: `/organization/${orgId}/sales/reserved`,
      parent: 'sales',
    },
    {
      key: 'closed',
      title: i18n.translate`closed`,
      url: `/organization/${orgId}/sales/closed`,
      parent: 'sales',
    },
    {
      Icon: Lightbulb,
      key: 'insights',
      title: i18n.translate`insights`,
      url: `/organization/${orgId}/insights`,
    },
  ] as const;

type PageList = ReturnType<typeof pageList>;
type Mapping<N extends number> = { [K in PageList[N]['key']]: PageList[N] };
export type PageMap = Mapping<number>;
export type PageKey = keyof PageMap;

export const pageMap = (orgId: Organization['id']): PageMap => {
  const list = pageList(orgId);

  return list.reduce((acc, page) => {
    acc[page.key] = page;
    return acc;
  }, {} as PageMap);
};

interface Props {
  breadcrumbs: PageKey[];
  className?: string;
  orgId: Organization['id'];
}

export function Navigation(props: Props) {
  const languagePack = useLanguagePack();
  const pages = pageList(props.orgId);

  return (
    <div className={cx(styles.container, props.className)}>
      {pages
        .filter(page => {
          if ('parent' in page) {
            return props.breadcrumbs.includes(page.parent);
          }
          return true;
        })
        .map(page => {
          const { key, title, url } = page;
          const titleStr = title(languagePack);
          const isSubMenu = 'parent' in page;
          const isSelected = props.breadcrumbs.includes(key);

          return (
            <div
              className={cx(styles.item, {
                [styles.subItem]: isSubMenu,
              })}
              key={key}
            >
              <Link href={url}>
                <Empty
                  className={cx(styles.link, {
                    [styles.notSelected]: !isSelected,
                  })}
                  style={{ textTransform: isSubMenu ? 'none' : undefined }}
                >
                  {'Icon' in page && <page.Icon className={styles.icon} />}
                  {titleStr}
                </Empty>
              </Link>
            </div>
          );
        })}
    </div>
  );
}
