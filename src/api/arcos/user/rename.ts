import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { verifyTokenByReq } from "../../../auth/token";
import { userExists } from "../../../auth/user";
import { CommitOk, getDB } from "../../../db/main";
import { createDataRes, Error, Ok } from "../../../server/return";
import { TokenDB } from "../../../tokens/interface";

export async function ArcOSUserRename(
  req: IncomingMessage,
  res: ServerResponse
) {
  const query = url.parse(req.url as string, true).query;
  const newUsername = atob(query["newname"] as string);
  const username = await verifyTokenByReq(req);

  if (!username) return;

  if (await userExists(newUsername))
    return Ok(
      res,
      Error("Can't rename user", "The new username already exists.", false)
    );

  const cdb = (await getDB("cred")) as { [key: string]: string };
  const pdb = (await getDB("pref")) as { [key: string]: any };
  const tdb = (await getDB("tokens")) as TokenDB;

  cdb[newUsername] = cdb[username];
  pdb[newUsername] = pdb[username];

  const tokenEntries = Object.entries(tdb);

  for (let i = 0; i < tokenEntries.length; i++) {
    if (tdb[i][1] == username) tdb[i][1] == newUsername;
  }

  delete pdb[username];
  delete cdb[username];

  Ok(
    res,
    createDataRes(
      {
        username,
        newUsername,
        userData: pdb[newUsername],
      },
      true
    )
  );
}
