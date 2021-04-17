interface Cookies {
  [cookieName: string]: string;
}

export function parse(cookiesStr?: string) {
  if (!cookiesStr) {
    return {};
  }

  try {
    return cookiesStr.split(';').reduce((acc, str) => {
      const [name, value] = str.split(/=(.*)$/, 2);
      acc[name.trim()] = value.trim();
      return acc;
    }, {} as Cookies);
  } catch (e) {
    return {};
  }
}
