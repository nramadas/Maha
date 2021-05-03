import { nanoid } from 'nanoid';
import React, { createContext, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { TransitionMotion, spring } from 'react-motion';

import { useTextToString } from '@/hooks/useTextToString';
import { getMessage } from '@/lib/errors/getMessage';
import { ErrorType } from '@/lib/errors/type';
import { Notification } from '@/models/Notification';
import { NotificationType } from '@/models/NotificationType';

import styles from './index.module.scss';
import { Msg } from './Msg';

const SPRING_CONFIG = {
  stiffness: 300,
  damping: 40,
};

interface DisplayNotification extends Notification {
  dismissAfter?: number;
  key: string;
}

export interface NotificationInput {
  dismissAfter?: DisplayNotification['dismissAfter'];
  message: DisplayNotification['message'];
  type?: DisplayNotification['type'];
}

interface Props {
  /**
   * Standard React children
   */
  children?: React.ReactNode;
  /**
   * Function that returns the container the Tooltip should be rendered into.
   */
  getContainer: () => HTMLElement | null;
}

interface NotificationDetails {
  displayNotification(notification: NotificationInput): void;
}

export const NotificationContext = createContext<NotificationDetails>({
  displayNotification: () => null,
});

export function NotificationsProvider(props: Props) {
  const [current, setCurrent] = useState<DisplayNotification[]>([]);
  const textToString = useTextToString();

  const { children, getContainer } = props;
  const container = getContainer();

  const displayNotification = useCallback(
    (notification: NotificationInput) => {
      const message = getMessage(notification.message as ErrorType);

      setCurrent([
        ...current,
        {
          dismissAfter: notification.dismissAfter,
          key: nanoid(),
          message: textToString(message || notification.message),
          type: notification.type || NotificationType.Message,
        },
      ]);
    },
    [current, setCurrent],
  );

  const removeNotification = useCallback(
    (notication: DisplayNotification) => {
      setCurrent(current.filter(c => c.key !== notication.key));
    },
    [current, setCurrent],
  );

  return (
    <>
      <NotificationContext.Provider value={{ displayNotification }}>
        {children}
      </NotificationContext.Provider>
      {container &&
        createPortal(
          <TransitionMotion
            willEnter={() => ({
              marginLeft: 300,
              opacity: 0,
            })}
            willLeave={() => ({
              marginLeft: spring(300, SPRING_CONFIG),
              opacity: spring(0, SPRING_CONFIG),
            })}
            styles={current.map(n => ({
              key: n.key,
              data: n,
              style: {
                marginLeft: spring(0, SPRING_CONFIG),
                opacity: spring(100, SPRING_CONFIG),
              },
            }))}
          >
            {interpolatedStyles => (
              <div className={styles.container}>
                {interpolatedStyles.map(item => (
                  <div
                    id={item.key}
                    key={item.key}
                    style={{
                      marginLeft: `${item.style.marginLeft}px`,
                      opacity: `${item.style.opacity / 100}`,
                    }}
                  >
                    <Msg
                      dismissAfter={item.data.dismissAfter}
                      notification={item.data}
                      onDismiss={() => removeNotification(item.data)}
                    />
                  </div>
                ))}
              </div>
            )}
          </TransitionMotion>,
          container,
        )}
    </>
  );
}
