export enum Route {
  AccountSettings = '/account/settings',
  BizLandingPage = '/biz',
  ContinueAuthentication = '/auth/continue',
  CreateBiz = '/org/create',
  Home = '/',
  JoinBiz = '/org/join',
  Logout = '/logout',
}

export enum BizRoute {
  AddProperty = '/properties/add',
  EditProperty = '/properties/edit',
  Insights = '/insights',
  Members = '/members',
  Overview = '/',
  Properties = '/properties',
  Roles = '/members/roles',
  Sales = '/sales',
  SalesClosures = '/sales/closures',
  SalesLeads = '/sales/leads',
  SalesReservations = '/sales/reservations',
  SalesVisits = '/sales/visits',
}

export function fullBizRoute(subRoute: BizRoute) {
  return `${Route.BizLandingPage}${subRoute}`;
}
