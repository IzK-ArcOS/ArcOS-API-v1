import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { verifyTokenByReq } from "../../../auth/token";
import { deleteMessage } from "../../../messaging/main";
import { Error, Ok } from "../../../server/return";

export async function ArcOSMessagesDelete(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = (await verifyTokenByReq(req)) as string;

  const query = parse(req.url as string, true).query;
  const id = atob(query["id"] as string);

  if (!id)
    return Ok(res, Error("Can't delete message", "The ID is invalid"), 400);

  const message = await deleteMessage(username, id);

  if (!message)
    return Ok(
      res,
      Error(
        "Can't delete message",
        "No message with that ID exists or you don't have permission to access it."
      )
    );

  Ok(res, "", 200);
}
