export type Nominal<kind, name> = kind & {
  __nominal?: name;
};

export type NominalID<name> = Nominal<string, name>;
