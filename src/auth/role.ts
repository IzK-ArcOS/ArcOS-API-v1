import { getDB } from "../db/main";
import { UserPreferences } from "./pref";

export async function isAdmin(username: string): Promise<boolean> {
  console.log(btoa(username));
  const pdb = (await getDB("pref")) as { [key: string]: UserPreferences };
  const cdb = (await getDB("cred")) as { [key: string]: string };

  const userdata = pdb[username];
  const credstrn = cdb[username];

  if (userdata && credstrn) {
    const role = userdata.acc.admin;

    return !!role;
  }

  return false;
}

export async function isDisabled(username: string): Promise<boolean> {
  const pdb = (await getDB("pref")) as { [key: string]: any };
  const cdb = (await getDB("cred")) as { [key: string]: string };

  const userdata = pdb[username];
  const credstrn = cdb[username];

  if (userdata && credstrn) {
    const role = userdata.role;

    return role == "disabled";
  }

  return false;
}
