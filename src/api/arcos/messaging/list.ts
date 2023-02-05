import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../auth/token";
import { getAllMessages } from "../../../messaging/main";
import { DataRes, Error, Ok } from "../../../server/return";

export async function ArcOSMessagesList(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = await verifyTokenByReq(req);

  if (!username)
    return Ok(
      res,
      Error("Can't get messages", "The username could not be determined."),
      400
    );

  Ok(res, DataRes(await getAllMessages(username), true), 200);
}
