import { verify } from "argon2";
import { getDB } from "../db/main";
import { isUsernameValid } from "./filter";

export async function verifyCredentials(username: string, password: string) {
  if (!isUsernameValid(username)) return false; // username filtering

  const cdb = await getDB("cred");
  const pdb = await getDB("pref");

  if (!cdb || !pdb) return false;
  if (!cdb[username] || !pdb[username]) return false;

  const valid = await verify(cdb[username], password);

  return valid || false;
}
