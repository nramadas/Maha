import { NominalID } from '@/lib/typeHelpers/nominal';

type Header = NominalID<'header'>;
type Payload = NominalID<'payload'>;
type Signature = NominalID<'signature'>;

export type AuthnIdToken = `${Header}.${Payload}.${Signature}`;
