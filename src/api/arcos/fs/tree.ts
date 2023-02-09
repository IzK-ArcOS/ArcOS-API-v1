import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../auth/token";
import { getUserTree } from "../../../fs/walker";
import { DataRes, Error, Ok } from "../../../server/return";

export async function ArcOSFSTree(req: IncomingMessage, res: ServerResponse) {
  const username = await verifyTokenByReq(req);

  if (!username)
    return Ok(
      res,
      Error(
        "Can't get user tree",
        "The token could not be verified: no username attached to definition."
      ),
      401
    );

  const contents = await getUserTree(username);

  if (!contents)
    return Ok(
      res,
      Error("Can't get user tree", "Unable to formulate a valid request"),
      400
    );

  Ok(res, DataRes(contents, true));
}
