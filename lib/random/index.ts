import crypto from 'crypto';

export const randomString = (length: number) =>
  new Promise<string>((res, rej) => {
    const buffer = Buffer.alloc(length);

    crypto.randomFill(buffer, (err, buf) => {
      if (err) {
        return rej(err);
      }

      return res(buf.toString('hex'));
    });
  });
