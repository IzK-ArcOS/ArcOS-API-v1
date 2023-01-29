import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../../auth/token";
import { Error, Ok } from "../../../../server/return";
import url from "url";
import { createUserDirectory } from "../../../../fs/dirs/mk";

export async function ArcOSFSDirCreate(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = await verifyTokenByReq(req);

  if (!username)
    return Ok(
      res,
      Error(
        "Can't get user directory",
        "The token could not be verified: no username attached to definition."
      ),
      401
    );

  const query = url.parse(req.url as string, true).query;
  const path = atob((query["path"] as string) || "Li8="); // fallback to './'

  const created = await createUserDirectory(username, path);

  if (!created)
    return Ok(
      res,
      Error(
        "Can't create user directory",
        "The directory already exists or the path is invalid."
      ),
      304
    );

  return Ok(
    res,
    Error(
      "Directory created",
      `Directory ${path} was created on account ${username}.`
    )
  );
}
