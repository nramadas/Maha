import { Route } from '@/lib/route';
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
      return Route.CreateBiz;
    case EmailAction.JoinOrganization:
      return options.orgName
        ? `${Route.JoinBiz}?orgName=${options.orgName}`
        : Route.Home;
  }
}
