export interface Data {}

export interface User extends Data {
  created: Date;
  email: string;
  id: string;
}

export const DEFAULT_DATA: Data = {};
