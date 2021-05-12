import React, { useState } from 'react';

import { Filled } from '@/components/controls/buttons/Filled';
import { Hollow } from '@/components/controls/buttons/Hollow';
import { Form } from '@/components/controls/Form';
import { i18n } from '@/lib/translate';

import { Amenities } from './Amenities';
import { Basic } from './Basic';
import { BedBath } from './BedBath';
import { formToCreateProperty } from './formToCreateProperty';
import styles from './index.module.scss';
import { Media } from './Media';
import { Other } from './Other';
import { Parking } from './Parking';
import { propertyToForm } from './propertyToForm';
import { Schools } from './Schools';
import { Utilities } from './Utilities';

interface Props {
  className?: string;
  defaultValues?: ReturnType<typeof propertyToForm>;
  onCancel?(): void;
  onSubmit?(formValues: ReturnType<typeof propertyToForm>): void;
}

export function PropertyForm(props: Props) {
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const isEditMode = !!props.defaultValues;

  return (
    <Form
      className={styles.container}
      defaultValues={props.defaultValues}
      onChange={formValues => setSubmitDisabled(!formValues.name)}
      onSubmit={formValues =>
        props.onSubmit?.(formToCreateProperty(formValues))
      }
    >
      <Basic />
      <Media isEditMode={isEditMode} />
      <BedBath />
      <Amenities />
      <Utilities />
      <Schools />
      <Parking />
      <Other />
      <footer className={styles.footer}>
        <Hollow
          onClick={e => {
            e.preventDefault();
            props.onCancel?.();
          }}
        >
          <i18n.Translate>Cancel</i18n.Translate>
        </Hollow>
        <Filled disabled={submitDisabled}>
          <i18n.Translate>Submit</i18n.Translate>
        </Filled>
      </footer>
    </Form>
  );
}
