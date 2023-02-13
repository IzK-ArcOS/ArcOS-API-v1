import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { verifyTokenByReq } from "../../../../auth/token";
import { getUserDirectory } from "../../../../fs/dirs/get";
import { DataRes, Error, Ok } from "../../../../server/return";

export async function ArcOSFSDirGet(req: IncomingMessage, res: ServerResponse) {
  const username = (await verifyTokenByReq(req)) as string;

  try {
    const query = url.parse(req.url as string, true).query;
    const path = atob((query["path"] as string) || "Li8="); // fallback to './'
    const contents = await getUserDirectory(username, path);

    if (!contents)
      return Ok(
        res,
        Error(
          "Can't get user directory",
          "The path is malformed or the directory does not exist."
        ),
        400
      );

    Ok(res, DataRes(contents, true));
  } catch {
    return Ok(
      res,
      Error(
        "Can't get user directory",
        "An error occured while parsing the path Base64. It may be malformed."
      ),
      400
    );
  }
}
