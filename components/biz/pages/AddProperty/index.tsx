import { gql } from '@urql/core';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation } from 'urql';

import { PropertyForm } from '@/components/biz/widgets/PropertyForm';
import { H6 } from '@/components/typography/H6';
import { useDisplayError } from '@/hooks/useDisplayNotification';
import { BizRoute, fullBizRoute } from '@/lib/route';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

const createPropertyMutation = gql`
  mutation($property: CreateProperty!) {
    createProperty(property: $property) {
      id
      location {
        address
      }
      media {
        id
        type
      }
      name
    }
  }
`;

interface Props {
  className?: string;
}

export function AddProperty(props: Props) {
  const router = useRouter();
  const [, createProperty] = useMutation(createPropertyMutation);
  const displayError = useDisplayError();

  return (
    <div>
      <header className={styles.header}>
        <H6>
          <i18n.Translate>Create a new property</i18n.Translate>
        </H6>
      </header>
      <PropertyForm
        onSubmit={property =>
          createProperty({ property }).then(result => {
            if (result.error) {
              displayError(i18n.translate`Could not create a new property`);
            } else {
              router.push(fullBizRoute(BizRoute.Properties));
            }
          })
        }
      />
    </div>
  );
}
