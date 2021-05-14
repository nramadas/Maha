import { MetropolitanKey } from '@/models/MetropolitanKey';

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

function metropolitanSubRoute(metro: MetropolitanKey): string {
  switch (metro) {
    case MetropolitanKey.Ahmedabad:
      return '/ahmedabad';
    case MetropolitanKey.Bengaluru:
      return '/bengaluru';
    case MetropolitanKey.Chennai:
      return '/chennai';
    case MetropolitanKey.Delhi:
      return '/delhi';
    case MetropolitanKey.Hyderabad:
      return '/hyderabad';
    case MetropolitanKey.Kolkata:
      return '/kolkata';
    case MetropolitanKey.Mumbai:
      return '/mumbai';
    case MetropolitanKey.Thiruvananthapuram:
      return '/thiruvananthapuram';
    case MetropolitanKey.Visakhapatnam:
      return '/visakhapatnam';
  }
}

export function metropolitanRoute(metro: MetropolitanKey) {
  return `${Route.Explore}${metropolitanSubRoute(metro)}`;
}

export function fromMetropolitanSubRouteText(route: string) {
  switch (route) {
    case 'ahmedabad':
      return MetropolitanKey.Ahmedabad;
    case 'bengaluru':
      return MetropolitanKey.Bengaluru;
    case 'chennai':
      return MetropolitanKey.Chennai;
    case 'delhi':
      return MetropolitanKey.Delhi;
    case 'hyderabad':
      return MetropolitanKey.Hyderabad;
    case 'kolkata':
      return MetropolitanKey.Kolkata;
    case 'mumbai':
      return MetropolitanKey.Mumbai;
    case 'thiruvananthapuram':
      return MetropolitanKey.Thiruvananthapuram;
    case 'visakhapatnam':
      return MetropolitanKey.Visakhapatnam;
  }
}
