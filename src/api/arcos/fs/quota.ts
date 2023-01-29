import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../auth/token";
import { getUsedSpace, MAX_QUOTA } from "../../../fs/quota/main";
import { DataRes, Ok } from "../../../server/return";

export async function ArcOSFSQuota(req: IncomingMessage, res: ServerResponse) {
  const username = (await verifyTokenByReq(req)) as string;

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
    ),
    200
  );
}
