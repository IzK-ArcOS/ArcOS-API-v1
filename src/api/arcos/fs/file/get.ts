import { readFile } from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";
import mime from "mime-types";
import url from "url";
import { verifyTokenByReq } from "../../../../auth/token";
import { getUserPath, userPathExists } from "../../../../fs/path";
import { Error, Ok } from "../../../../server/return";
export async function ArcOSFSFileGet(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = await verifyTokenByReq(req);

  if (!username) {
    return Ok(
      res,
      Error(
        "Can't get user directory",
        "The token could not be verified: no username attached to definition."
      ),
      401
    );
  }
  try {
    const query = url.parse(req.url as string, true).query;
    const pathParam = atob((query["path"] as string) || "Li8="); // fallback to './'
    const filePath = await getUserPath(username, false, pathParam);

    if (!filePath || !(await userPathExists(username, pathParam))) {
      return Ok(
        res,
        Error(
          "Unable to get file",
          "The file could not be found or you don't have access to it."
        ),
        404
      );
    }

    try {
      const contents = await readFile(filePath);

      const mimeType = mime.lookup(pathParam);

      if (!mimeType)
        return Ok(
          res,
          Error(
            "Unable to get file",
            "The server could not determine the mime type of the file."
          )
        );

      res.setHeader("content-type", mimeType);
      res.statusCode = 200;
      res.write(contents);
      res.end();
    } catch {
      return Ok(
        res,
        Error(
          "Unable to get file",
          "The file may not exist or it is a directory."
        ),
        400
      );
    }
  } catch {
    Ok(
      res,
      Error(
        "Can't get user directory",
        "An error occured while parsing the path Base64. It may be malformed."
      ),
      400
    );
  }
}
