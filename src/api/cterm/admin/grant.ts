import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { isAdmin, isDisabled } from "../../../auth/role";
import { userExists } from "../../../auth/user";
import { commitChanges, getDB, setDB } from "../../../db/main";
import { createErrorRes, writeToRes } from "../../../server/return";

export async function adminGrant(req: IncomingMessage, res: ServerResponse) {
  const query = url.parse(req.url as string, true).query;
  const username = atob(query["user"] as string);
  const pdb = (await getDB("pref")) as { [key: string]: any };

  if (!(await userExists(username))) {
    res.statusCode = 406;

    writeToRes(
      res,
      createErrorRes(
        "Cannot grant admin",
        "Cannot grant admin to a user that doesn't exist."
      )
    );

    return;
  }

  if ((await isDisabled(username)) || (await isAdmin(username))) {
    res.statusCode = 405;

    writeToRes(
      res,
      createErrorRes(
        "Cannot grant admin",
        "Can only grant admin to regular users. Disabled or banned users cannot be granted admin."
      )
    );

    return;
  }

  pdb[username].role = "admin";

  commitChanges("grant admin", res, { db: "pref", data: pdb });
}
