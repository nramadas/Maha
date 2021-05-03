import { EmailAction } from '@/models/EmailAction';

interface Options {
  action?: EmailAction;
  email?: string;
  orgName?: string;
  token?: string;
}

export function emailActionToUrl(options: Options) {
  switch (options.action) {
    case EmailAction.CreateOrganization:
      return '/org/create';
    case EmailAction.JoinOrganization:
      return options.orgName ? `/org/join?orgName=${options.orgName}` : '/';
  }
}
