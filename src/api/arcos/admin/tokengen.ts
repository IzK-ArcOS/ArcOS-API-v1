import { randomUUID } from "crypto";
import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { userExists } from "../../../auth/user";
import { getDB, setDB } from "../../../db/main";
import { DataRes, Error, Ok } from "../../../server/return";
import { TokenDB } from "../../../tokens/interface";

export async function ArcOSAdminTokenGen(
  req: IncomingMessage,
  res: ServerResponse
) {
  const query = parse(req.url as string, true).query;
  const username = atob(query["user"] as string) as string;

  if (!(await userExists(username)))
    return Ok(
      res,
      Error(
        "Could not generate user token",
        "The specified user does not exist",
        false
      ),
      400
    );

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
      },
      true
    )
  );
}
