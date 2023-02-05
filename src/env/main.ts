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
  [
    "msg",
    {
      name: "Messaging",
      path: `${dbRoot}/msg.json`,
    },
  ],
]);
export const fsroot = "./fs";

export interface DB {
  name: string;
  path: string;
}
