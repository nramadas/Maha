import { ErrorType } from '@/lib/errors/type';
import { NotificationType } from '@/models/NotificationType';
import { Text } from '@/models/Text';

export interface Notification {
  message: ErrorType | Text;
  type: NotificationType;
}
