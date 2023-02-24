import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { verifyTokenByReq } from "../../../../auth/token";
import { userExists } from "../../../../auth/user";
import { CommitOk, getDB } from "../../../../db/main";
import { Error, Ok } from "../../../../server/return";

export async function ArcOSAdminPreferencesUpdate(
  req: IncomingMessage,
  res: ServerResponse
) {
  const chunks: Buffer[] = [];

  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", async () => {
    const data = Buffer.concat(chunks).toString();

    const query = parse(req.url as string, true).query;
    const username = atob(query["user"] as string) as string;

    if (!(await userExists(username)))
      return Ok(
        res,
        Error(
          "Unable to get user properties",
          "The specified user could not be found",
          false
        ),
        400
      );

    let newJson = {};

    try {
      newJson = JSON.parse(data);
    } catch {
      return Ok(
        res,
        Error(
          "Can't update user properties",
          "Parameter 'data' could not be parsed as JSON."
        ),
        400
      );
    }

    const pdb = await getDB("pref");

    if (!pdb) {
      return Ok(
        res,
        Error(
          "Can't update user properties",
          "A database error occured. Please try again later."
        ),
        500
      );
    }

    pdb[username] = newJson;

    await CommitOk("update user properties", res, {
      db: "pref",
      data: pdb,
    });
  });
}
