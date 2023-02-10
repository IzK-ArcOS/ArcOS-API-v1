import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../../auth/token";
import { CommitOk, getDB } from "../../../../db/main";
import { Error, Ok } from "../../../../server/return";

export async function ArcOSUserPropertiesUpdate(
  req: IncomingMessage,
  res: ServerResponse
) {
  const chunks: Buffer[] = [];

  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", async () => {
    const data = Buffer.concat(chunks).toString();

    const username = (await verifyTokenByReq(req)) || "";

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
