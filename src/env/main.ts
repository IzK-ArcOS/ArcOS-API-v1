import { mkdir } from "fs/promises";

export let dbRoot = "";
export let templateRoot = "";
export let fsroot = "";
export let DBs = new Map<string, DB>();
export const apiRevision = 0;

export async function setRoots(fs: string, db: string, tmp: string) {
  const paths = [fs, db, tmp];

  for (let i = 0; i < paths.length; i++) {
    try {
      await mkdir(paths[i]);
    } catch {
      console.log(
        `[FS] [setRoots] [${paths[i]}] Unable to create data directory. It may already exist.`
      );
    }
  }

  fsroot = fs;
  dbRoot = db;
  templateRoot = tmp;

  DBs = new Map<string, DB>([
    [
      "cred",
      {
        name: "Credentials",
        path: `${dbRoot}/cred.json`,
        noCache: true,
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
  noCache?: boolean;
}
