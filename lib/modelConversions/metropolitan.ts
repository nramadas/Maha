import { Metropolitan } from '@/models/Metropolitan';
import { MetropolitanKey } from '@/models/MetropolitanKey';

export function convertFromEnum(key: MetropolitanKey): Metropolitan {
  switch (key) {
    case MetropolitanKey.Ahmedabad:
      return {
        key,
        center: {
          lat: 23.033863,
          lng: 72.585022,
        },
      };
    case MetropolitanKey.Bengaluru:
      return {
        key,
        center: {
          lat: 12.972442,
          lng: 77.580643,
        },
      };
    case MetropolitanKey.Chennai:
      return {
        key,
        center: {
          lat: 13.067439,
          lng: 80.237617,
        },
      };
    case MetropolitanKey.Delhi:
      return {
        key,
        center: {
          lat: 28.65381,
          lng: 77.22897,
        },
      };
    case MetropolitanKey.Hyderabad:
      return {
        key,
        center: {
          lat: 17.38405,
          lng: 78.45636,
        },
      };
    case MetropolitanKey.Kolkata:
      return {
        key,
        center: {
          lat: 22.56263,
          lng: 88.36304,
        },
      };
    case MetropolitanKey.Mumbai:
      return {
        key,
        center: {
          lat: 19.07283,
          lng: 72.88261,
        },
      };
    case MetropolitanKey.Thiruvananthapuram:
      return {
        key,
        center: {
          lat: 8.4855,
          lng: 76.94924,
        },
      };
    case MetropolitanKey.Visakhapatnam:
      return {
        key,
        center: {
          lat: 17.68009,
          lng: 83.20161,
        },
      };
  }
}
