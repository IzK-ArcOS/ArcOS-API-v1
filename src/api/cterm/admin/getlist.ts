import { IncomingMessage, ServerResponse } from "http";
import { getDB } from "../../../db/main";
import { createDataRes, writeToRes } from "../../../server/return";

export async function adminGetList(req: IncomingMessage, res: ServerResponse) {
  const pdb = (await getDB("pref")) as { [key: string]: any };

  let admins: { [key: string]: object } = {};

  for (const user in pdb) {
    if (pdb[user].role == "admin") admins[user] = pdb[user];
  }

  writeToRes(res, createDataRes(admins, true));
}
