import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../auth/token";
import { CommitOk, getDB } from "../../../db/main";
import { TokenDB } from "../../../tokens/interface";

export async function ArcOSUserDelete(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = await verifyTokenByReq(req);

  if (!username) return;

  const cdb = (await getDB("cred")) as { [key: string]: string };
  const pdb = (await getDB("pref")) as { [key: string]: any };
  const tdb = (await getDB("tokens")) as TokenDB;

  const tokenEntries = Object.entries(tdb);

  delete cdb[username];
  delete pdb[username];

  for (let i = 0; i < tokenEntries.length; i++) {
    if (tokenEntries[i][1] == username) delete tdb[tokenEntries[i][0]];
  }

  CommitOk(
    "delete user",
    res,
    { db: "cred", data: cdb },
    { db: "pref", data: pdb },
    { db: "tokens", data: tdb }
  );
}
