import { IncomingMessage } from "http";
import { getDB } from "../db/main";
import { Endpoint } from "../server/endpoint/main";
import { TokenDB } from "../tokens/interface";

export async function verifyToken(
  endpoint: Endpoint,
  token: string
): Promise<string | false> {
  if (!endpoint.tokenAuth) return false;

  const tdb = (await getDB("tokens")) as TokenDB;

  return tdb[token] || false;
}

export async function verifyTokenByReq(req: IncomingMessage) {
  const token = req.headers.authorization
    ? req.headers.authorization?.replace("Bearer", "").trim()
    : "";

  const tdb = (await getDB("tokens")) as TokenDB;

  return tdb[token] || false;
}

export function getToken(req: IncomingMessage): string {
  return req.headers.authorization
    ? req.headers.authorization?.replace("Bearer", "").trim()
    : "";
}
