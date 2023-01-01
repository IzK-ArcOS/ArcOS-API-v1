import argon2 from "argon2";
import { getDB, setDB } from "../db/main";
import { DefaultUserdata, UserPreferences } from "./pref";

export async function createUser(
  username: string,
  password: string
): Promise<createUserReturn> {
  const cdb = await getDB("cred");
  const pdb = await getDB("pref");

  if (!cdb || !pdb) return "dbgeterror";
  if (cdb[username] || pdb[username]) return "userexists";

  const pswd = await argon2.hash(password, {
    type: argon2.argon2i,
    memoryCost: 2 ** 16,
    timeCost: 6,
    hashLength: 32,
  });

  const userdata: UserPreferences = DefaultUserdata;

  pdb[username] = userdata;
  cdb[username] = pswd;

  const valid = (await setDB("cred", cdb)) && (await setDB("pref", pdb));

  return valid ? "created" : "dbseterror";
}

export async function userExists(username: string) {
  const pdb = (await getDB("pref")) as { [key: string]: any };
  const cdb = (await getDB("cred")) as { [key: string]: string };

  return !!(pdb[username] && cdb[username]);
}

export type createUserReturn =
  | "created"
  | "dbseterror"
  | "dbgeterror"
  | "userexists";
