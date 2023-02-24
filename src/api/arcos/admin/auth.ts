import { randomUUID } from "crypto";
import { IncomingMessage, ServerResponse } from "http";
import { getAuth } from "../../../auth/get";
import { getDB, setDB } from "../../../db/main";
import { DataRes, Error, Ok } from "../../../server/return";
import { TokenDB } from "../../../tokens/interface";

export async function ArcOSAdminAuth(
  req: IncomingMessage,
  res: ServerResponse
) {
  const { username } = getAuth(req);

  const uuid = randomUUID();

  const tdb = (await getDB("tokens")) as TokenDB;

  tdb[uuid] = username;

  const valid = await setDB("tokens", tdb);

  if (!valid) {
    return Ok(
      res,
      Error("Could not generate token", "The database could not be written."),
      500
    );
  }

  Ok(
    res,
    DataRes(
      {
        username,
        token: uuid,
        admin: true,
      },
      true
    )
  );
}
