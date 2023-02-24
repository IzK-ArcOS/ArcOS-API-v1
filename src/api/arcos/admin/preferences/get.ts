import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { userExists } from "../../../../auth/user";
import { getDB } from "../../../../db/main";
import { DataRes, Error, Ok } from "../../../../server/return";

export async function ArcOSAdminPreferencesGet(
  req: IncomingMessage,
  res: ServerResponse
) {
  const query = parse(req.url as string, true).query;
  const username = atob(query["user"] as string) as string;

  if (!(await userExists(username)))
    return Ok(
      res,
      Error(
        "Unable to get user properties",
        "The specified user could not be found",
        false
      ),
      400
    );

  const pdb = await getDB("pref");

  if (!pdb) {
    return Ok(
      res,
      Error(
        "Can't get properties",
        "A database error occured. Please try again later."
      ),
      500
    );
  }

  Ok(res, DataRes(pdb[username], true));
}
