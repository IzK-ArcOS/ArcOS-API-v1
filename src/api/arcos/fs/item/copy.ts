import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../../auth/token";
import { getUserPath, userPathExists } from "../../../../fs/path";
import { Ok, Error } from "../../../../server/return";
import url from "url";
import { copyFile } from "fs/promises";

export async function ArcOSFSItemCopy(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = await verifyTokenByReq(req);

  if (!username) {
    return Ok(
      res,
      Error(
        "Can't copy item",
        "The token could not be verified: no username attached to definition."
      ),
      401
    );
  }

  try {
    const query = url.parse(req.url as string, true).query;
    const pathParam = atob((query["path"] as string) || "Li8="); // fallback to './'
    const targetParam = atob((query["target"] as string) || "Li8="); // fallback to './'
    const oldFilePath = await getUserPath(username, false, pathParam);
    const newFilePath = await getUserPath(username, true, targetParam);

    if (!newFilePath || (await userPathExists(newFilePath)))
      return Ok(
        res,
        Error("Unable to copy item", "The target filename already exists."),
        400
      );

    if (!oldFilePath || !(await userPathExists(username, pathParam)))
      return Ok(
        res,
        Error(
          "Unable to copy item",
          "The file could not be found or you don't have access to it."
        ),
        404
      );

    await copyFile(oldFilePath, newFilePath);

    Ok(res, "", 200);
  } catch {
    Ok(
      res,
      Error(
        "Can't copy item",
        "An error occured while copying the item. You may not have permission to access it."
      ),
      400
    );
  }
}
