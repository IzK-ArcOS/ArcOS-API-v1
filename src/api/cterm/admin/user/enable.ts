import { IncomingMessage, ServerResponse } from "http";
import { commitChanges, getDB, setDB } from "../../../../db/main";
import url from "url";
import { userExists } from "../../../../auth/user";
import { createErrorRes, writeToRes } from "../../../../server/return";

export async function adminUserEnable(
  req: IncomingMessage,
  res: ServerResponse
) {
  const query = url.parse(req.url as string, true).query;
  const pdb = (await getDB("pref")) as { [key: string]: any };
  const username = atob(query["user"] as string);

  if (!(await userExists(username))) {
    res.statusCode = 406;

    writeToRes(
      res,
      createErrorRes(
        "Cannot enable user",
        "Cannot enable a user that doesn't exist."
      )
    );

    return;
  }

  pdb[username].role = "regular";

  commitChanges("enable user", res, { db: "pref", data: pdb });
}
