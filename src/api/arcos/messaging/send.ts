import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { verifyTokenByReq } from "../../../auth/token";
import { sendMessage } from "../../../messaging/main";
import { DataRes, Error, Ok } from "../../../server/return";

export async function ArcOSMessagesSend(
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
    const sender = (await verifyTokenByReq(req)) as string;

    const content = Buffer.concat(body).toString();

    if (content.length > 2000)
      return Ok(
        res,
        Error(
          "Could not send message",
          "The message content exceeeds the maximum allowed length."
        ),
        400
      );

    const messageId = await sendMessage(sender, target, content);

    if (!messageId)
      return Ok(
        res,
        Error("Could not send message", "The database could not be written."),
        500
      );

    Ok(
      res,
      DataRes(
        {
          sender,
          receiver: target,
          id: messageId,
        },
        true
      )
    );
  });
}
