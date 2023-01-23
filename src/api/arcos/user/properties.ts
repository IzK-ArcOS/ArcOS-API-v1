import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../auth/token";
import { getDB } from "../../../db/main";
import { createErrorRes, writeToRes } from "../../../server/return";

export async function ArcOSUserProperties(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = await verifyTokenByReq(req);

  if (!username) {
    res.statusCode = 401;
    return writeToRes(
      res,
      createErrorRes("Can't get properties", "User could not be found.")
    );
  }

  console.log(username);

  const pdb = await getDB("pref");

  if (!pdb) {
    res.statusCode = 500;

    return writeToRes(
      res,
      createErrorRes(
        "Can't get properties",
        "A database error occured. Please try again later."
      )
    );
  }

  writeToRes(res, JSON.stringify({ ...pdb[username], valid: true }));
}