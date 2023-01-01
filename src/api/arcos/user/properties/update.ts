import url from "url";
import { IncomingMessage, ServerResponse } from "http";
import { createErrorRes, writeToRes } from "../../../../server/return";
import { commitChanges, getDB } from "../../../../db/main";
import { verifyTokenByReq } from "../../../../auth/token";

export async function ArcOSUserPropertiesUpdate(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = (await verifyTokenByReq(req)) || "";
  const query = url.parse(req.url as string, true).query;
  const newData = atob(query.data as string);

  let newJson = {};

  try {
    newJson = JSON.parse(newData);
  } catch {
    res.statusCode = 400;

    return writeToRes(
      res,
      createErrorRes(
        "Can't update user properties",
        "Parameter 'data' could not be parsed as JSON."
      )
    );
  }

  const pdb = await getDB("pref");

  if (!pdb) {
    res.statusCode = 500;

    return writeToRes(
      res,
      createErrorRes(
        "Can't update user properties",
        "A database error occured. Please try again later."
      )
    );
  }

  pdb[username] = newJson;

  await commitChanges("update user properties", res, { db: "pref", data: pdb });
}
