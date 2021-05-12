import cx from 'classnames';
import React, { useState } from 'react';

import { Filled } from '@/components/controls/buttons/Filled';
import { PickGrow } from '@/components/controls/chips/PickGrow';
import { Form } from '@/components/controls/Form';
import { Input } from '@/components/controls/Input';
import { Overline } from '@/components/typography/Overline';
import { name as roleName } from '@/lib/role/name';
import { i18n } from '@/lib/translate';
import { CommonRoleType } from '@/models/CommonRoleType';
import { Role as RoleModel } from '@/models/Role';

import styles from './index.module.scss';

export type Role = Pick<RoleModel, 'id' | 'name'>;

interface FormValues {
  email: string;
  roles: {
    id: RoleModel['id'];
  }[];
}

interface Props {
  className?: string;
  roles: Role[];
  onSubmit(formValues: FormValues): void;
}

export function Add(props: Props) {
  const [email, setEmail] = useState('');

  return (
    <Form
      className={cx(styles.form, props.className)}
      onSubmit={formValues =>
        props.onSubmit({
          email: formValues.email,
          roles: (formValues.roles || []).map((role: any) => ({
            id: role.value,
          })),
        })
      }
    >
      <Input
        label={i18n.translate`email`}
        name="email"
        value={email}
        onInput={e => setEmail(e.currentTarget.value)}
      />
      <div>
        <div className={styles.label}>
          <Overline>
            <i18n.Translate>Roles:</i18n.Translate>
          </Overline>
        </div>
        <PickGrow
          name="roles"
          choices={props.roles
            .filter(r => r.name !== CommonRoleType.Owner)
            .map(role => ({
              text: roleName(role),
              value: role.id,
            }))}
        />
      </div>
      <Filled className={styles.button} disabled={!email}>
        <i18n.Translate>Invite</i18n.Translate>
      </Filled>
    </Form>
  );
}
