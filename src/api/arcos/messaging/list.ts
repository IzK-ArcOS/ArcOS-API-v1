import { IncomingMessage, ServerResponse } from "http";
import { verifyTokenByReq } from "../../../auth/token";
import { getAllMessages } from "../../../messaging/main";
import { DataRes, Error, Ok } from "../../../server/return";

export async function ArcOSMessagesList(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = (await verifyTokenByReq(req)) as string;

  Ok(res, DataRes(await getAllMessages(username), true), 200);
}
