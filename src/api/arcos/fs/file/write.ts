import { writeFile } from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { verifyTokenByReq } from "../../../../auth/token";
import { getUserPath } from "../../../../fs/path";
import { checkSpaceRequirement } from "../../../../fs/quota/main";
import { Error, Ok } from "../../../../server/return";

export async function ArcOSFSFileWrite(
  req: IncomingMessage,
  res: ServerResponse
) {
  const body: any[] = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", async () => {
    const b = Buffer.concat(body);

    const username = (await verifyTokenByReq(req)) || "";

    let query;
    let pathParam;
    let filePath;
    /* 
    try { */
    query = url.parse(req.url as string, true).query;
    pathParam = atob((query["path"] as string) || "Li8="); // fallback to './'
    filePath = await getUserPath(username, true, pathParam);

    /*     } catch {
      return Ok(
        res,
        Error("Can't write file", "The path Base64 could not be parsed."),
        400
      );
    } */

    if (!filePath)
      return Ok(
        res,
        Error(
          "Can't write file",
          "The path is invalid or the directory does not exist."
        ),
        400
      );

    const size = b.byteLength;

    const spaceSufficient = await checkSpaceRequirement(username, size);

    if (!spaceSufficient)
      return Ok(
        res,
        Error(
          "Can't write file",
          "There's not enough space free on your account."
        ),
        409
      );

    try {
      await writeFile(filePath as string, b);

      return Ok(res, "", 200);
    } catch {
      return Ok(
        res,
        Error(
          "Can't write file",
          "An error occured while writing the changes to the disk."
        ),
        500
      );
    }
  });
}
