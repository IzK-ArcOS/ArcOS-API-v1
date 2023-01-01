import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { userExists } from "../../../../auth/user";
import { commitChanges, getDB } from "../../../../db/main";
import { createErrorRes, writeToRes } from "../../../../server/return";
import { bannedSetters } from "../../pref/set";

export async function adminPrefDelete(
  req: IncomingMessage,
  res: ServerResponse
) {
  const query = url.parse(req.url as string, true).query;
  const pdb = (await getDB("pref")) as { [key: string]: any };
  const username = atob(query["user"] as string);
  const item = query["item"] as string;

  if (!(await userExists(username))) {
    res.statusCode = 406;

    writeToRes(
      res,
      createErrorRes(
        "Cannot delete preference",
        "Cannot delete preference of a user that doesn't exist."
      )
    );

    return;
  }

  const prefItem = pdb[username][atob(item)];

  if (prefItem) {
    if (bannedSetters.includes(prefItem)) {
      writeToRes(
        res,
        createErrorRes(
          "Cannot delete preference",
          "Cannot delete a read-only preference item."
        )
      );

      return;
    }

    delete pdb[username][atob(item)];

    commitChanges("delete preference", res, { db: "pref", data: pdb });

    return;
  }

  res.statusCode = 406;

  writeToRes(
    res,
    createErrorRes(
      "Preference delete failed",
      "Cannot delete a non-existent preference item.",
      false
    )
  );
}
