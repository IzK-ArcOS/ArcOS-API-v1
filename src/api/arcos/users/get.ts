import { IncomingMessage, ServerResponse } from "http";
import { UserPreferences } from "../../../auth/pref";
import { getDB } from "../../../db/main";
import { DataRes, Ok } from "../../../server/return";

export async function ArcOSUsersGet(_: IncomingMessage, res: ServerResponse) {
  const pdb = (await getDB("pref")) as { [key: string]: UserPreferences };

  const entries = Object.entries(pdb);

  let returnValue = [];

  for (let i = 0; i < entries.length; i++) {
    returnValue.push({
      username: entries[i][0],
      acc: {
        enabled: entries[i][1].acc.enabled,
        admin: entries[i][1].acc.admin,
        profilePicture: entries[i][1].acc.profilePicture,
      },
    });
  }

  return Ok(res, DataRes(returnValue, true));
}
