import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../../auth/token";
import { getUserPath, userPathExists } from "../../../../fs/path";
import { Ok, Error } from "../../../../server/return";
import url from "url";
import { rename, rm, rmdir, stat } from "fs/promises";

export async function ArcOSFSItemRename(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = await verifyTokenByReq(req);

  if (!username) {
    return Ok(
      res,
      Error(
        "Can't rename item",
        "The token could not be verified: no username attached to definition."
      ),
      401
    );
  }

  try {
    const query = url.parse(req.url as string, true).query;
    const pathParam = atob((query["oldpath"] as string) || "Li8="); // fallback to './'
    const newParam = atob((query["newpath"] as string) || "Li8="); // fallback to './'
    const oldFilePath = await getUserPath(username, false, pathParam);
    const newFilePath = await getUserPath(username, true, newParam);

    if (!newFilePath || (await userPathExists(newFilePath)))
      return Ok(
        res,
        Error("Unable to rename item", "The target filename already exists."),
        400
      );

    if (!oldFilePath || !(await userPathExists(username, pathParam)))
      return Ok(
        res,
        Error(
          "Unable to rename item",
          "The file could not be found or you don't have access to it."
        ),
        404
      );

    await rename(oldFilePath, newFilePath);

    Ok(res, "", 200);
  } catch {
    Ok(
      res,
      Error(
        "Can't rename item",
        "An error occured while renaming the item. You may not have permission to access it."
      ),
      400
    );
  }
}
