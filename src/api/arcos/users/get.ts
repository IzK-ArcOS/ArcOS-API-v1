import { IncomingMessage, ServerResponse } from "http";
import { UserPreferences } from "../../../auth/pref";
import { getDB } from "../../../db/main";
import { createDataRes, writeToRes } from "../../../server/return";

export async function ArcOSUsersGet(_: IncomingMessage, res: ServerResponse) {
  const pdb = (await getDB("pref")) as { [key: string]: UserPreferences };

  const entries = Object.entries(pdb);

  let returnValue = [];

  for (let i = 0; i < entries.length; i++) {
    returnValue.push({
      username: entries[i][0],
      profilePicture: entries[i][1].acc.profilePicture,
      enabled: entries[i][1].acc.enabled,
      admin: entries[i][1].acc.admin,
    });
  }

  return writeToRes(res, createDataRes(returnValue, true));
}
