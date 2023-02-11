import { IncomingMessage, ServerResponse } from "http";
import { getToken } from "../../auth/token";
import { CommitOk, getDB } from "../../db/main";
import { Ok } from "../../server/return";
import { TokenDB } from "../../tokens/interface";

export async function ArcOSLogoff(req: IncomingMessage, res: ServerResponse) {
  const token = getToken(req);

  const tdb = (await getDB("tokens")) as TokenDB;

  if (!token) return Ok(res, "", 400);

  delete tdb[token];

  CommitOk("logoff", res, { db: "tokens", data: tdb });
}
