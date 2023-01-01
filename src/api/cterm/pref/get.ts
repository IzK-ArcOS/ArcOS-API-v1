import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { getAuth } from "../../../auth/get";
import { getDB } from "../../../db/main";
import {
  createDataRes,
  createErrorRes,
  writeToRes,
} from "../../../server/return";

export async function prefGet(req: IncomingMessage, res: ServerResponse) {
  const query = url.parse(req.url as string, true).query;
  const pdb = (await getDB("pref")) as { [key: string]: any };
  const { username } = getAuth(req);
  const item = query["item"] as string;

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
