import { AuthN } from '@keratin/authn-node';

import { AuthnIdToken } from '@/models/AuthnIdToken';

const authn = new AuthN({
  issuer: process.env.AUTHN_URL!,
  audiences: process.env.APP_DOMAINS!.split(','),
  username: process.env.HTTP_AUTH_USERNAME!,
  password: process.env.HTTP_AUTH_PASSWORD!,
});

export function extractAuthId(token: AuthnIdToken) {
  return authn.subjectFrom(token);
}
