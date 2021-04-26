import { publicRequest, privateRequest } from '@/lib/authn/request';
import { randomString } from '@/lib/random';

interface Failure {
  ok: false;
}

export const initiatePasswordlessLogin = (email: string) =>
  publicRequest({
    url: `/session/token?username=${encodeURIComponent(email)}`,
    method: 'GET',
  }).then(() => ({ ok: true }));

interface SubmitPasswordlessLoginSuccess {
  ok: true;
  idToken: string;
  refreshToken: string;
}

type SubmitPasswordlessLogin = SubmitPasswordlessLoginSuccess | Failure;

export const submitPasswordlessLogin = (token: string) =>
  publicRequest({
    url: '/session/token',
    method: 'POST',
    body: { token },
  }).then<SubmitPasswordlessLogin>(async res => {
    try {
      const result = await res.json();

      if (result.errors) {
        return { ok: false } as Failure;
      }

      const cookies = res.headers.get('set-cookie');

      let refreshToken: string = '';

      cookies?.split(';').forEach(part => {
        if (part.startsWith('authn=')) {
          const [, t] = part.split('authn=');
          refreshToken = t;
        }
      });

      const idToken: string = result.result.id_token;

      return {
        ok: true,
        idToken,
        refreshToken,
      } as SubmitPasswordlessLoginSuccess;
    } catch (e) {
      return { ok: false } as Failure;
    }
  });

interface RefreshSessionSuccess {
  ok: true;
  idToken: string;
}

type RefreshSession = RefreshSessionSuccess | Failure;

export const refreshSession = (refreshToken: string) =>
  publicRequest({
    url: '/session/refresh',
    method: 'GET',
    cookie: `authn=${refreshToken}`,
  }).then<RefreshSession>(async res => {
    try {
      const result = await res.json();

      if (result.errors) {
        return { ok: false } as Failure;
      }

      const idToken: string = result.result.id_token;

      return {
        idToken,
        ok: true,
      } as RefreshSessionSuccess;
    } catch (e) {
      return { ok: false } as Failure;
    }
  });

interface UserExistsSuccess {
  ok: true;
  exists: boolean;
}

type UserExists = UserExistsSuccess | Failure;

export const userExists = (email: string) =>
  publicRequest({
    url: `/accounts/available?username=${encodeURIComponent(email)}`,
    method: 'GET',
  }).then<UserExists>(async res => {
    try {
      const result = await res.json();

      if (result.errors) {
        return {
          ok: true,
          exists: true,
        } as UserExistsSuccess;
      }

      return {
        ok: true,
        exists: false,
      } as UserExistsSuccess;
    } catch (e) {
      return { ok: false } as Failure;
    }
  });

interface CreateUserSuccess {
  ok: true;
}

type CreateUser = CreateUserSuccess | Failure;

export const createUser = (email: string) =>
  randomString(20)
    .then(password =>
      publicRequest({
        url: '/accounts',
        method: 'POST',
        body: { username: email, password },
      }),
    )
    .then<CreateUser>(async res => {
      try {
        const result = await res.json();

        if (result.errors) {
          return { ok: false } as Failure;
        }

        return { ok: true } as CreateUserSuccess;
      } catch (e) {
        return { ok: false } as Failure;
      }
    });

interface GetEmailSuccess {
  ok: true;
  email: string;
}

type GetEmail = GetEmailSuccess | Failure;

export const getEmail = (authId: string) =>
  privateRequest({
    url: `/accounts/${authId}`,
    method: 'GET',
  }).then<GetEmail>(async res => {
    try {
      const result = await res.json();

      if (result.errors) {
        return { ok: false } as Failure;
      }

      const email = result.result.username;

      return {
        email,
        ok: true,
      } as GetEmailSuccess;
    } catch (e) {
      return { ok: false } as Failure;
    }
  });
