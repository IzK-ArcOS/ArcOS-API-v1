import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../auth/token";
import { getUserTree } from "../../../fs/walker";
import { DataRes, Error, Ok } from "../../../server/return";

export async function ArcOSFSTree(req: IncomingMessage, res: ServerResponse) {
  const username = (await verifyTokenByReq(req)) as string;

  const contents = await getUserTree(username);

  if (!contents)
    return Ok(
      res,
      Error("Can't get user tree", "Unable to formulate a valid request"),
      400
    );

  Ok(res, DataRes(contents, true));
}
