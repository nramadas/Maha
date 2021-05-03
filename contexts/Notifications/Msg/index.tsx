import React, { forwardRef } from 'react';

import { Close } from '@/components/icons/Close';
import { Body2 } from '@/components/typography/Body2';
import { useLanguagePack } from '@/hooks/useLanguagePack';
import { useTimeout } from '@/hooks/useTimeout';
import { getMessage } from '@/lib/errors/getMessage';
import { ErrorType } from '@/lib/errors/type';
import { LanguagePack } from '@/models/LanguagePack';
import { Notification } from '@/models/Notification';
import { NotificationType } from '@/models/NotificationType';

import styles from './index.module.scss';

function backgroundColor(type: NotificationType): string {
  switch (type) {
    case NotificationType.Error:
      return 'var(--color-error)';
    case NotificationType.Warning:
      return 'var(--color-warning)';
    case NotificationType.Message:
      return 'var(--color-success)';
  }
}

function getText(n: Notification, lanaguagePack: LanguagePack) {
  const text = getMessage(n.message as ErrorType);

  if (text) {
    return text(lanaguagePack);
  }

  return n.message as string;
}

interface Props {
  dismissAfter?: number;
  notification: Notification;
  onDismiss(): void;
}

export const Msg = forwardRef<HTMLDivElement, Props>(function Msg(props, ref) {
  const languagePack = useLanguagePack();

  useTimeout(() => {
    if (props.dismissAfter) {
      props.onDismiss();
    }
  }, props.dismissAfter);

  return (
    <div
      className={styles.container}
      ref={ref}
      style={{
        backgroundColor: backgroundColor(props.notification.type),
      }}
    >
      <div className={styles.closeContainer} onClick={props.onDismiss}>
        <Close className={styles.close} />
      </div>
      <div className={styles.content}>
        <Body2>{getText(props.notification, languagePack)}</Body2>
      </div>
    </div>
  );
});
