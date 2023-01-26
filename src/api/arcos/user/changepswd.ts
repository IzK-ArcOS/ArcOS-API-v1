import { IncomingMessage, ServerResponse } from "http";
import { getAuth } from "../../../auth/get";
import url from "url";
import { CommitOk, getDB } from "../../../db/main";
import argon2 from "argon2";

export async function ArcOSUserChangePassword(
  req: IncomingMessage,
  res: ServerResponse
) {
  const { username } = getAuth(req);
  const query = url.parse(req.url as string, true).query;
  const newPswd = atob(query["new"] as string);

  const cdb = (await getDB("cred")) as { [key: string]: string };

  const pswd = await argon2.hash(newPswd, {
    type: argon2.argon2i,
    memoryCost: 2 ** 10,
    timeCost: 2,
    hashLength: 16,
  });

  cdb[username] = pswd;

  CommitOk("change password", res, { db: "cred", data: cdb });
}
