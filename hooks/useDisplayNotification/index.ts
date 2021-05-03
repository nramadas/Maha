import { useContext } from 'react';

import {
  NotificationContext,
  NotificationInput,
} from '@/contexts/Notifications';
import { NotificationType } from '@/models/NotificationType';

export function useDisplayError() {
  const context = useContext(NotificationContext);

  return (message: NotificationInput['message']) =>
    context.displayNotification({
      message,
      type: NotificationType.Error,
    });
}

export function useDisplayMessage() {
  const context = useContext(NotificationContext);

  return (message: NotificationInput['message']) =>
    context.displayNotification({
      message,
      dismissAfter: 2500,
      type: NotificationType.Message,
    });
}

export function useDisplayWarning() {
  const context = useContext(NotificationContext);

  return (message: NotificationInput['message']) =>
    context.displayNotification({
      message,
      dismissAfter: 5000,
      type: NotificationType.Warning,
    });
}
