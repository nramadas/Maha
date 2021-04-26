import { EmailAction } from '@/models/EmailAction';

export function emailActionToUrl(action: EmailAction) {
  switch (action) {
    case EmailAction.CreateOrganization:
      return '/organizations/create';
  }
}
