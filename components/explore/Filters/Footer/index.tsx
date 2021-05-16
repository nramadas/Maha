import React, { useCallback, useEffect, useState } from 'react';

import { Empty } from '@/components/controls/buttons/Empty';
import { useForm } from '@/hooks/useForm';
import { removeNilKeys } from '@/lib/removeNilKeys';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
}

export function Footer(props: Props) {
  const form = useForm();
  const [disabled, setDisabled] = useState(true);

  const change = useCallback(
    formValues => setDisabled(!Object.keys(removeNilKeys(formValues)).length),
    [form, setDisabled],
  );

  const reset = useCallback(() => {
    form.setFormValues({});
    setDisabled(true);
  }, [form, setDisabled]);

  useEffect(() => {
    form.onFormChange(change);
    return () => form.removeFormChange(change);
  }, [form, change]);

  return (
    <footer className={styles.footer}>
      <Empty disabled={disabled} onClick={reset}>
        <i18n.Translate>Reset filters</i18n.Translate>
      </Empty>
    </footer>
  );
}
