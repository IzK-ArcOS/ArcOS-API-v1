import url from "url";
import { IncomingMessage, ServerResponse } from "http";
import { Error, Ok } from "../../../../server/return";
import { commitChanges, getDB } from "../../../../db/main";
import { verifyTokenByReq } from "../../../../auth/token";

export async function ArcOSUserPropertiesUpdate(
  req: IncomingMessage,
  res: ServerResponse
) {
  const chunks: Buffer[] = [];

  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", async () => {
    console.log("all parts/chunks have arrived");

    const data = Buffer.concat(chunks).toString();

    const username = (await verifyTokenByReq(req)) || "";

    let newJson = {};

    try {
      newJson = JSON.parse(data);
    } catch {
      res.statusCode = 400;

      return Ok(
        res,
        Error(
          "Can't update user properties",
          "Parameter 'data' could not be parsed as JSON."
        )
      );
    }

    const pdb = await getDB("pref");

    if (!pdb) {
      res.statusCode = 500;

      return Ok(
        res,
        Error(
          "Can't update user properties",
          "A database error occured. Please try again later."
        )
      );
    }

    pdb[username] = newJson;

    await commitChanges("update user properties", res, {
      db: "pref",
      data: pdb,
    });
  });
}
