import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { isAdmin, isDisabled } from "../../../auth/role";
import { userExists } from "../../../auth/user";
import { commitChanges, getDB } from "../../../db/main";
import { createErrorRes, writeToRes } from "../../../server/return";

export async function adminRevoke(req: IncomingMessage, res: ServerResponse) {
  const query = url.parse(req.url as string, true).query;
  const targetUser = atob(query["user"] as string);
  const pdb = (await getDB("pref")) as { [key: string]: any };

  if (!(await userExists(targetUser))) {
    res.statusCode = 406;

    writeToRes(
      res,
      createErrorRes(
        "Cannot revoke admin",
        "Cannot revoke admin from a user that doesn't exist."
      )
    );

    return;
  }

  if ((await isDisabled(targetUser)) || !(await isAdmin(targetUser))) {
    res.statusCode = 405;

    writeToRes(
      res,
      createErrorRes(
        "Cannot revoke admin",
        "Can only revoke admin from admin users."
      )
    );

    return;
  }

  pdb[targetUser].role = "regular";

  commitChanges("revoke admin", res, { db: "pref", data: pdb });
}
