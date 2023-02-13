import { rm } from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../auth/token";
import { CommitOk, getDB } from "../../../db/main";
import { fsroot } from "../../../env/main";
import { MsgDB } from "../../../messaging/interface";
import { TokenDB } from "../../../tokens/interface";

export async function ArcOSUserDelete(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = (await verifyTokenByReq(req)) as string;

  const cdb = (await getDB("cred")) as { [key: string]: string };
  const pdb = (await getDB("pref")) as { [key: string]: any };
  const tdb = (await getDB("tokens")) as TokenDB;
  const mdb = (await getDB("msg")) as MsgDB;

  const tokenEntries = Object.entries(tdb);
  const msgEntries = Object.entries(mdb);

  delete cdb[username];
  delete pdb[username];

  for (let i = 0; i < tokenEntries.length; i++) {
    if (tokenEntries[i][1] == username) delete tdb[tokenEntries[i][0]];
  }

  try {
    await rm(`${fsroot}/${username}`, { recursive: true, force: true });
  } catch {
    console.warn("User directory could not be deleted!");
  }

  const placeholder = `deleted#${Math.floor(Math.random() * 1e9)}`;

  for (let i = 0; i < msgEntries.length; i++) {
    const msg = msgEntries[i][1];

    if (msg.receiver == username) msg.receiver = placeholder;
    if (msg.sender == username) msg.sender = placeholder;
  }

  CommitOk(
    "delete user",
    res,
    { db: "cred", data: cdb },
    { db: "pref", data: pdb },
    { db: "tokens", data: tdb },
    { db: "msg", data: mdb }
  );
}
