import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { verifyTokenByReq } from "../../../auth/token";
import {
  Message,
  PartiallyExtendedMessage,
} from "../../../messaging/interface";
import {
  generatePartial,
  getAllMessages,
  getMessage,
} from "../../../messaging/main";
import { DataRes, Error, Ok } from "../../../server/return";

export async function ArcOSMessagesThread(
  req: IncomingMessage,
  res: ServerResponse
) {
  const username = (await verifyTokenByReq(req)) as string;

  const messages = await getAllMessages(username);

  const tree: PartiallyExtendedMessage[] = getTree(messages);

  const query = parse(req.url as string, true).query;

  let id;
  try {
    id = query["id"] ? atob(query["id"] as string) : "";
  } catch {
    id = "";
  }

  if (!id) return Ok(res, DataRes(tree, true), 200);

  const message = (await getMessage(username, id)) as Message;

  if (!message)
    return Ok(
      res,
      Error(
        "Can't get message thread",
        "The requested root message could not be found."
      ),
      400
    );

  const partial = generatePartial(message) as PartiallyExtendedMessage;

  const response = {
    ...partial,
    replies: getNested(messages, partial.id as string),
  };

  Ok(res, DataRes(response, true), 200);
}

function getTree(messages: PartiallyExtendedMessage[]) {
  let result: PartiallyExtendedMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].replyingTo) continue;

    messages[i].replies = getNested(messages, messages[i].id as string);

    result.push(messages[i]);
  }

  return result;
}

function getNested(messages: PartiallyExtendedMessage[], id: string) {
  const result = messages.filter((message: PartiallyExtendedMessage) => {
    if (message.replyingTo == id) return true;

    return false;
  });

  for (let i = 0; i < result.length; i++) {
    result[i].replies = getNested(messages, result[i].id as string);
  }

  return result;
}
