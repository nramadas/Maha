import { Metropolitan } from '@/models/Metropolitan';

export enum Route {
  AccountSettings = '/account/settings',
  BizLandingPage = '/biz',
  ContinueAuthentication = '/auth/continue',
  CreateBiz = '/org/create',
  Explore = '/explore',
  Home = '/',
  JoinBiz = '/org/join',
  Login = '/login',
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

function metropolitanSubRoute(metro: Metropolitan): string {
  switch (metro) {
    case Metropolitan.Ahmedabad:
      return '/ahmedabad';
    case Metropolitan.Bengaluru:
      return '/bengaluru';
    case Metropolitan.Chennai:
      return '/chennai';
    case Metropolitan.Delhi:
      return '/delhi';
    case Metropolitan.Hyderabad:
      return '/hyderabad';
    case Metropolitan.Kolkata:
      return '/kolkata';
    case Metropolitan.Mumbai:
      return '/mumbai';
    case Metropolitan.Thiruvananthapuram:
      return '/thiruvananthapuram';
    case Metropolitan.Visakhapatnam:
      return '/visakhapatnam';
  }
}

export function metropolitanRoute(metro: Metropolitan) {
  return `${Route.Explore}${metropolitanSubRoute(metro)}`;
}
