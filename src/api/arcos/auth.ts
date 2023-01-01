import { IncomingMessage, ServerResponse } from "http";
import { getAuth } from "../../auth/get";
import { randomUUID } from "crypto";
import { getDB, setDB } from "../../db/main";
import { TokenDB } from "../../tokens/interface";
import { createDataRes, createErrorRes, writeToRes } from "../../server/return";

export async function ArcOSAuth(req: IncomingMessage, res: ServerResponse) {
  const { username } = getAuth(req);

  const uuid = randomUUID();

  const tdb = (await getDB("tokens")) as TokenDB;

  tdb[uuid] = username;

  const valid = await setDB("tokens", tdb);

  if (!valid) {
    res.statusCode = 500;
    return writeToRes(
      res,
      createErrorRes(
        "Could not generate token",
        "The database could not be written."
      )
    );
  }

  writeToRes(
    res,
    createDataRes(
      {
        username,
        token: uuid,
      },
      true
    )
  );
}
