import { getDB, setDB } from "../db/main";
import { TokenDB } from "./interface";

export async function getTokens() {
  return (await getDB("tokens")) as TokenDB;
}

export async function generateToken(username: string) {
  const uuid = crypto.randomUUID();

  const tdb = await getTokens();

  tdb[uuid] = username;

  return await setDB("tokens", tdb);
}

export async function deleteToken(token: string) {
  const tdb = await getTokens();

  delete tdb[token];

  return await setDB("tokens", tdb);
}
