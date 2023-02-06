import { getDB, setDB } from "../db/main";
import { Message, MsgDB, PartialMessage } from "./interface";

export async function getAllMessages(
  username: string
): Promise<PartialMessage[]> {
  const db = (await getDB("msg")) as MsgDB;

  const entries = Object.entries(db);

  const messages: PartialMessage[] = [];

  for (let i = 0; i < entries.length; i++) {
    const msg = entries[i][1];

    if (msg.receiver == username || msg.sender == username)
      messages.push(generatePartial({ ...msg, id: entries[i][0] }));
  }

  return messages;
}

export async function replyMessage(
  targetId: string,
  id: string
): Promise<boolean> {
  const db = (await getDB("msg")) as MsgDB;

  const target = db[targetId];
  const source = db[id];

  if (!target || !source) return false;

  source.replyingTo = targetId;
  target.replies.push(id);

  db[targetId] = target;
  db[id] = source;

  return await setDB("msg", db);
}

export async function sendMessage(
  sender: string,
  receiver: string,
  body: string
): Promise<string | false> {
  const message: Message = {
    sender,
    receiver,
    replies: [],
    id: `${Math.floor(Math.random() * 1e9)}`,
    body,
    timestamp: new Date().getTime(),
    read: false,
  };

  const db = (await getDB("msg")) as MsgDB;

  db[message.id as string] = message;

  const written = await setDB("msg", db);

  return written ? (message.id as string) : false;
}

export async function deleteMessage(username: string, id: string) {
  const message = await getMessage(username, id);

  if (!message || message.receiver != username) return false;

  const db = (await getDB("msg")) as MsgDB;

  delete db[id];

  return await setDB("msg", db);
}

export async function getMessage(
  username: string,
  id: string
): Promise<Message | false> {
  const db = (await getDB("msg")) as MsgDB;

  const message = db[id];

  if (!message || (message.receiver != username && message.sender != username))
    return false;

  return db[id];
}

export function generatePartial(message: Message): PartialMessage {
  return {
    sender: message.sender,
    receiver: message.receiver,
    partialBody: message.body.substring(0, Math.min(message.body.length, 30)),
    timestamp: message.timestamp,
    replyingTo: message.replyingTo,
    id: message.id,
    read: message.read,
  };
}

export async function markAsRead(id: string): Promise<boolean> {
  const db = (await getDB("msg")) as MsgDB;

  if (!db[id]) return false;

  db[id].read = true;

  return await setDB("msg", db);
}
