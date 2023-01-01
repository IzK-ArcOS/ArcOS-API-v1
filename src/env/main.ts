export const dbRoot = "./db";
export const DBs = new Map<string, DB>([
  [
    "cred",
    {
      name: "Credentials",
      path: `${dbRoot}/cred.json`,
    },
  ],
  [
    "pref",
    {
      name: "Preferences",
      path: `${dbRoot}/pref.json`,
    },
  ],
  [
    "tokens",
    {
      name: "Tokens",
      path: `${dbRoot}/tokens.json`,
    },
  ],
]);

export interface DB {
  name: string;
  path: string;
}
