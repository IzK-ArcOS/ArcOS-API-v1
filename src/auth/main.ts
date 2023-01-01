import { verify } from "argon2";
import { getDB } from "../db/main";

export async function verifyCredentials(username: string, password: string) {
  const cdb = await getDB("cred");
  const pdb = await getDB("pref");

  if (!cdb || !pdb) return false;
  if (!cdb[username] || !pdb[username]) return false;

  const valid = await verify(cdb[username], password);

  return valid || false;
}
