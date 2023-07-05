import { rename } from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { verifyTokenByReq } from "../../../auth/token";
import { userExists } from "../../../auth/user";
import { CommitOk, getDB } from "../../../db/main";
import { fsroot } from "../../../env/main";
import { MsgDB } from "../../../messaging/interface";
import { Error, Ok } from "../../../server/return";
import { TokenDB } from "../../../tokens/interface";
import { isUsernameValid } from "../../../auth/filter";

export async function ArcOSUserRename(
  req: IncomingMessage,
  res: ServerResponse
) {
  const query = url.parse(req.url as string, true).query;
  const newUsername = atob(query["newname"] as string);
  const username = (await verifyTokenByReq(req)) as string;

  if (await userExists(newUsername))
    return Ok(
      res,
      Error("Can't rename user", "The new username already exists.", false)
    );

  if (!isUsernameValid(newUsername))
    return Ok(
      res,
      Error(
        "Can't rename user",
        "The new username contains prohibited characters.",
        false
      )
    );

  const cdb = (await getDB("cred")) as { [key: string]: string };
  const pdb = (await getDB("pref")) as { [key: string]: any };
  const tdb = (await getDB("tokens")) as TokenDB;
  const mdb = (await getDB("msg")) as MsgDB;

  cdb[newUsername] = cdb[username];
  pdb[newUsername] = pdb[username];

  const tokenEntries = Object.entries(tdb);

  for (let i = 0; i < tokenEntries.length; i++) {
    if (tokenEntries[i][1] == username) tdb[tokenEntries[i][0]] = newUsername;
  }

  delete pdb[username];
  delete cdb[username];

  try {
    await rename(`${fsroot}/${username}`, `${fsroot}/${newUsername}`);
  } catch {
    console.warn("User directory could not be renamed!");
  }

  const entries = Object.entries(mdb);

  for (let i = 0; i < entries.length; i++) {
    const msg = entries[i][1];

    if (msg.receiver == username) msg.receiver = newUsername;
    if (msg.sender == username) msg.sender = newUsername;
  }

  CommitOk(
    "rename user",
    res,
    { db: "pref", data: pdb },
    { db: "cred", data: cdb },
    { db: "tokens", data: tdb },
    { db: "msg", data: mdb }
  );
}
