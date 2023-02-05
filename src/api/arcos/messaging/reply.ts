import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { verifyTokenByReq } from "../../../auth/token";
import { replyMessage, sendMessage } from "../../../messaging/main";
import { DataRes, Error, Ok } from "../../../server/return";

export async function ArcOSMessagesReply(
  req: IncomingMessage,
  res: ServerResponse
) {
  const body: any[] = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", async () => {
    const query = parse(req.url as string, true).query;
    const target = atob(query["target"] as string);
    const replier = query["id"] as string;
    const sender = (await verifyTokenByReq(req)) as string;

    const content = Buffer.concat(body).toString();

    const messageId = await sendMessage(sender, target, content);

    const replyStatus = await replyMessage(replier, messageId as string);

    if (!replyStatus || !messageId)
      return Ok(
        res,
        Error(
          "Could not reply to message",
          "The database could not be written."
        ),
        500
      );

    Ok(
      res,
      DataRes(
        {
          sender,
          receiver: target,
          id: messageId,
          replier,
        },
        true
      )
    );
  });
}
