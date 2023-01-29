import { IncomingMessage, ServerResponse } from "http";
import { getAuth } from "../../../../auth/get";
import { getUserDirectory } from "../../../../fs/main";
import url from "url";
import { verifyTokenByReq } from "../../../../auth/token";
import { DataRes, Error, Ok } from "../../../../server/return";

export async function ArcOSFSDirGet(req: IncomingMessage, res: ServerResponse) {
  const username = await verifyTokenByReq(req);

  if (!username)
    return Ok(
      res,
      Error("Can't get user directory", "The username could not be found.")
    );

  const query = url.parse(req.url as string, true).query;
  const path = atob((query["path"] as string) || "Li8="); // fallback to './'
  const contents = await getUserDirectory(username, path);

  if (!contents)
    return Ok(
      res,
      Error(
        "Can't get user directory",
        "The path is malformed or the directory does not exist."
      )
    );

  Ok(res, DataRes(contents, true));
}
