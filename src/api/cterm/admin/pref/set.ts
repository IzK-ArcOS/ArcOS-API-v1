import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { userExists } from "../../../../auth/user";
import { commitChanges, getDB, setDB } from "../../../../db/main";
import { createErrorRes, writeToRes } from "../../../../server/return";

export async function adminPrefSet(req: IncomingMessage, res: ServerResponse) {
  const query = url.parse(req.url as string, true).query;
  const pdb = (await getDB("pref")) as { [key: string]: any };

  const username = atob(query["user"] as string);
  const item = query["item"] as string;
  const value = query["value"] as string;

  if (!(await userExists(username))) {
    res.statusCode = 406;

    writeToRes(
      res,
      createErrorRes(
        "Cannot set preferences",
        "Cannot set a preference item for a user that doesn't exist."
      )
    );

    return;
  }

  pdb[username][atob(item)] = atob(value);

  commitChanges("set preferences", res, {db:"pref", data:pdb});
}
