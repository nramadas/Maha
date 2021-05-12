import React, { useState } from 'react';

import { Filled } from '@/components/controls/buttons/Filled';
import { PickGrow } from '@/components/controls/chips/PickGrow';
import { Form } from '@/components/controls/Form';
import { Input } from '@/components/controls/Input';
import { H6 } from '@/components/typography/H6';
import { Overline } from '@/components/typography/Overline';
import { useLanguagePack } from '@/hooks/useLanguagePack';
import { name as permissionName } from '@/lib/permissions/name';
import { i18n } from '@/lib/translate';
import { Permission } from '@/models/Permission';

import styles from './index.module.scss';

interface FormValues {
  name: string;
  description?: string;
  permissions: Permission[];
}

interface Props {
  className?: string;
  onSubmit(formValues: FormValues): void;
}

export function Add(props: Props) {
  const languagePack = useLanguagePack();
  const [name, setName] = useState('');
  const allPermissions = Object.values(Permission);

  return (
    <article className={props.className}>
      <header className={styles.header}>
        <H6>
          <i18n.Translate>Add role</i18n.Translate>
        </H6>
      </header>
      <Form
        className={styles.form}
        onSubmit={formValues =>
          props.onSubmit({
            name: formValues.name,
            description: formValues.description,
            permissions: (formValues.permissions || []).map(
              (p: any) => p.value,
            ),
          })
        }
      >
        <Input
          label={i18n.translate`name`}
          name="name"
          value={name}
          onInput={e => setName(e.currentTarget.value)}
        />
        <Input label={i18n.translate`description`} name="description" />
        <div>
          <div className={styles.label}>
            <Overline>
              <i18n.Translate>Permissions:</i18n.Translate>
            </Overline>
          </div>
          <PickGrow
            name="permissions"
            choices={allPermissions.map(permission => ({
              value: permission,
              text: permissionName(permission)(languagePack),
            }))}
          />
        </div>
        <Filled className={styles.button} disabled={!name}>
          <i18n.Translate>Add</i18n.Translate>
        </Filled>
      </Form>
    </article>
  );
}
