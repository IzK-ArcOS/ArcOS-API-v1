import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { isAdmin } from "../../../auth/role";
import { commitChanges, getDB, setDB } from "../../../db/main";
import { createErrorRes, writeToRes } from "../../../server/return";
import { userExists } from "../../../auth/user";

export async function adminDelUser(req: IncomingMessage, res: ServerResponse) {
  const query = url.parse(req.url as string, true).query;

  const username = atob(query["user"] as string);

  const cdb = (await getDB("cred")) as { [key: string]: string };
  const pdb = (await getDB("pref")) as { [key: string]: any };

  if (!(await userExists(username))) {
    res.statusCode = 406;
    writeToRes(
      res,
      createErrorRes(
        "Cannot delete user",
        "Cannot delete a user that doesn't exist."
      )
    );
    return;
  }

  if (await isAdmin(username)) {
    res.statusCode = 405;
    writeToRes(
      res,
      createErrorRes(
        "Cannot delete user",
        "It's not possible for an admin to delete another admin."
      )
    );
    return;
  }

  delete cdb[username];
  delete pdb[username];

  commitChanges("delete user", res, { db: "cred", data: cdb }, { db: "pref", data: pdb });
}
