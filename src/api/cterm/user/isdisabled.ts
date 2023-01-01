import { IncomingMessage, ServerResponse } from "http";
import { isDisabled } from "../../../auth/role";
import { createDataRes, writeToRes } from "../../../server/return";
import url from "url";

export async function userIsDisabled(
  req: IncomingMessage,
  res: ServerResponse
) {
  const query = url.parse(req.url as string, true).query;
  const user = atob(query["user"] as string);

  writeToRes(res, createDataRes({ disabled: await isDisabled(user) }, true));
}
