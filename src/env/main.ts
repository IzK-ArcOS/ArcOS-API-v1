import { mkdir } from "fs/promises";

export let dbRoot = "";
export let DBs = new Map<string, DB>();
export let fsroot = "";

export async function setRoots(fs: string, db: string) {
  try {
    await mkdir(fs);
    await mkdir(db);
  } catch {
    console.log(
      "setRoots: directories could not be created. They may already exist."
    );
  }

  fsroot = fs;
  dbRoot = db;

  console.log(fsroot, dbRoot);

  DBs = new Map<string, DB>([
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
}

export interface DB {
  name: string;
  path: string;
}
