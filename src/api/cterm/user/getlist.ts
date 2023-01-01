import { IncomingMessage, ServerResponse } from "http";
import { getDB } from "../../../db/main";
import { createDataRes, writeToRes } from "../../../server/return";

export async function UserGetList(_: IncomingMessage, res: ServerResponse) {
  const pdb = (await getDB("pref")) as { [key: string]: any };

  writeToRes(res, createDataRes(pdb, true));
}
