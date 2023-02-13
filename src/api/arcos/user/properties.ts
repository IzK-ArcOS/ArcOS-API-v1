import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../auth/token";
import { getDB } from "../../../db/main";
import { Error, Ok } from "../../../server/return";

export async function ArcOSUserProperties(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = (await verifyTokenByReq(req)) as string;

  const pdb = await getDB("pref");

  if (!pdb) {
    return Ok(
      res,
      Error(
        "Can't get properties",
        "A database error occured. Please try again later."
      ),
      500
    );
  }

  Ok(res, JSON.stringify({ ...pdb[username], valid: true }));
}
