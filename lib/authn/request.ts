import { encode } from '@/lib/base64';

const headers = {
  'Content-Type': 'application/json',
  Origin: process.env.APP_URL!,
};

interface Request {
  url: string;
  method: 'POST' | 'GET';
  body?: object;
}

function url(u: string) {
  return `${process.env.AUTHN_URL}${u}`;
}

export const publicRequest = (req: Request) =>
  fetch(url(req.url), {
    headers,
    method: req.method,
    body:
      req.body && req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
  })
    .then(r => r.json())
    .catch(function () {});

export const privateRequest = (req: Request) =>
  fetch(url(req.url), {
    headers: {
      ...headers,
      Authorization: `Basic ${encode(
        `${process.env.HTTP_AUTH_USERNAME}:${process.env.HTTP_AUTH_PASSWORD}`,
      )}`,
    },
    method: req.method,
    body:
      req.body && req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
  })
    .then(r => r.json())
    .catch(function () {});
