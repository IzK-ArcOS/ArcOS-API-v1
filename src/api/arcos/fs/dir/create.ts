import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { verifyTokenByReq } from "../../../../auth/token";
import { createUserDirectory } from "../../../../fs/dirs/mk";
import { Error, Ok } from "../../../../server/return";

export async function ArcOSFSDirCreate(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = (await verifyTokenByReq(req)) as string;

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
