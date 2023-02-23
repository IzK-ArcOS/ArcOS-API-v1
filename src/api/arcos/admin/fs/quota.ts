import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { userExists } from "../../../../auth/user";
import { getUsedSpace, MAX_QUOTA } from "../../../../fs/quota/main";
import { DataRes, Error, Ok } from "../../../../server/return";

export async function ArcOSAdminFSQuota(
  req: IncomingMessage,
  res: ServerResponse
) {
  const query = parse(req.url as string, true).query;
  const username = atob(query["user"] as string) as string;

  if (!(await userExists(username)))
    return Ok(
      res,
      Error(
        "Could not get FS quota",
        "The specified user does not exist",
        false
      ),
      400
    );

  const max = MAX_QUOTA;
  const used = await getUsedSpace(username);

  Ok(
    res,
    DataRes(
      {
        username,
        max,
        used,
        free: max - used,
      },
      true
    )
  );
}
