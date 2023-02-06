import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { verifyTokenByReq } from "../../../auth/token";
import { getMessage, markAsRead, sendMessage } from "../../../messaging/main";
import { DataRes, Error, Ok } from "../../../server/return";

export async function ArcOSMessagesGet(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = (await verifyTokenByReq(req)) as string;

  const query = parse(req.url as string, true).query;
  const id = atob(query["id"] as string);

  if (!id) return Ok(res, Error("Can't get message", "The ID is invalid"), 400);

  const message = await getMessage(username, id);

  await markAsRead(id);

  if (!message)
    return Ok(
      res,
      Error(
        "Can't get message",
        "No message with that ID exists or you don't have permission to access it."
      )
    );

  Ok(res, DataRes(message, true), 200);
}
