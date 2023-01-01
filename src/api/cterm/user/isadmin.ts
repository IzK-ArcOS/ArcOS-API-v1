import { IncomingMessage, ServerResponse } from "http";
import { getAuth } from "../../../auth/get";
import { isAdmin } from "../../../auth/role";
import { createDataRes, writeToRes } from "../../../server/return";

export async function userIsAdmin(req: IncomingMessage, res: ServerResponse) {
  const { username } = getAuth(req);

  writeToRes(res, createDataRes({ admin: await isAdmin(username) }, true));
}
