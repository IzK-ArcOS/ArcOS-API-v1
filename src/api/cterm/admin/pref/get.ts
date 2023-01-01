import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { userExists } from "../../../../auth/user";
import { getDB } from "../../../../db/main";
import {
  createDataRes,
  createErrorRes,
  writeToRes,
} from "../../../../server/return";

export async function adminPrefGet(req: IncomingMessage, res: ServerResponse) {
  const query = url.parse(req.url as string, true).query;
  const pdb = (await getDB("pref")) as { [key: string]: any };
  const username = atob(query["user"] as string);
  const item = query["item"] as string;

  if (!(await userExists(username))) {
    res.statusCode = 406;

    writeToRes(
      res,
      createErrorRes(
        "Cannot get preferences",
        "Cannot get preferences for a user that doesn't exist."
      )
    );

    return;
  }

  if (!item) {
    writeToRes(res, createDataRes(pdb[username], true));

    return;
  }

  const prefItem = pdb[username][atob(item)];

  if (prefItem) {
    writeToRes(
      res,
      createDataRes(JSON.parse(`{"${atob(item)}":"${prefItem}"}`), true)
    );

    return;
  }

  res.statusCode = 406;

  writeToRes(
    res,
    createErrorRes(
      "Preference get failed",
      "Cannot get a non-existent preference item.",
      false
    )
  );
}
