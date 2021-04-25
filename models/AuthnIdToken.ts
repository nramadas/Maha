import { Nominal, NominalID } from '@/lib/typeHelpers/nominal';

type Header = NominalID<'header'>;
type Payload = NominalID<'payload'>;
type Signature = NominalID<'signature'>;

export type AuthnIdToken = Nominal<
  `${Header}.${Payload}.${Signature}`,
  'authentication token'
>;
