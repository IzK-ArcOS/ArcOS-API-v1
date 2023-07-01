import { IncomingMessage } from "http";

export function getAuth(req: IncomingMessage) {
  const header = req.headers.authorization;

  const token = (header || "").split(/\s+/).pop() || "";

  const auth = Buffer.from(token, "base64").toString();
  const parts = auth.split(/:/);
  const username = parts.shift()?.trim() || "";
  const password = parts.join(":").trim();

  return { username, password };
}
