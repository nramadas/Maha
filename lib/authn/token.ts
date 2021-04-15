import { decode } from '@/lib/base64';
import { AuthnIdToken } from '@/models/AuthnIdToken';

interface Payload {
  aud: string[];
  auth_time: number;
  exp: number;
  iat: number;
  iss: number;
  sub: string;
}

export function extractPayload(token: AuthnIdToken) {
  const [, payloadEncodedStr] = token.split('.');

  try {
    const payloadStr = decode(payloadEncodedStr);
    return JSON.parse(payloadStr) as Payload;
  } catch (e) {
    return null;
  }
}
