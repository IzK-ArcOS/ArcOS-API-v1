import { IncomingMessage, ServerResponse } from "http";
import { getDB } from "../../../db/main";
import url from "url";
import { createDataRes, writeToRes } from "../../../server/return";

export async function userExists(req: IncomingMessage, res: ServerResponse) {
  const cdb = (await getDB("cred")) as { [key: string]: string };
  const pdb = (await getDB("pref")) as { [key: string]: any };
  const query = url.parse(req.url as string, true).query;
  const username = atob(query["user"] as string);
  const exists = !!(cdb[username] && pdb[username]);

  if (!exists) res.statusCode = 404;

  writeToRes(
    res,
    createDataRes(
      {
        exists: exists || false,
      },
      exists || false
    )
  );
}
