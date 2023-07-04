import { IncomingMessage, ServerResponse } from "http";
import { CONFIG } from "../config/store";
import url from "url";

export function checkAuthcode(req: IncomingMessage) {
  if (!CONFIG.authCode) return true;

  const query = url.parse(req.url as string, true).query;

  if (!query.ac) return false;

  return query.ac === CONFIG.authCode;
}
