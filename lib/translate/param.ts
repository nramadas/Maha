export interface Param {
  name: string;
  gender?: 'M' | 'F' | 'N';
  count?: number;
}

export function makeParamToken(param: Param) {
  let token = `%%${param.name}`;
  if (param.gender) {
    token += `.${param.gender}`;
  }
  if (typeof param.count === 'number') {
    switch (param.count) {
      case 0: {
        token += '.none';
        break;
      }
      case 1: {
        token += '.one';
        break;
      }
      default: {
        token += '.many';
      }
    }
  }
  return token;
}
