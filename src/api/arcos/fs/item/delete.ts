import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../../auth/token";
import { getUserPath, userPathExists } from "../../../../fs/path";
import { Ok, Error } from "../../../../server/return";
import url from "url";
import { rm, rmdir, stat } from "fs/promises";

export async function ArcOSFSItemDelete(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = await verifyTokenByReq(req);

  if (!username) {
    return Ok(
      res,
      Error(
        "Can't delete item",
        "The token could not be verified: no username attached to definition."
      ),
      401
    );
  }

  try {
    const query = url.parse(req.url as string, true).query;
    const pathParam = atob((query["path"] as string) || "Li8="); // fallback to './'
    const filePath = await getUserPath(username, false, pathParam);

    if (!filePath || !(await userPathExists(username, pathParam)))
      return Ok(
        res,
        Error(
          "Unable to delete item",
          "The file could not be found or you don't have access to it."
        ),
        404
      );

    rm(filePath, { recursive: true, force: true });
    Ok(res, "", 200);
  } catch {
    Ok(
      res,
      Error(
        "Can't get path for deletion",
        "An error occured while parsing the path Base64. It may be malformed."
      ),
      400
    );
  }
}
