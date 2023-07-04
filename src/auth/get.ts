import { IncomingMessage } from "http";
import { isUsernameValid } from "./filter";

export function getAuth(req: IncomingMessage) {
  const header = req.headers.authorization;
  const token = (header || "").split(/\s+/).pop() || "";
  const auth = Buffer.from(token, "base64").toString();
  const parts = auth.split(/:/);
  const username = parts.shift()?.trim() || "";
  const password = parts.join(":").trim();

  const userValid = isUsernameValid(username);

  return {
    username: userValid
      ? username.substring(0, Math.min(username.length, 25))
      : "",
    password,
  };
}
