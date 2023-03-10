import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { ServerResponse } from "http";
import { DB, DBs } from "../env/main";
import { Error, Ok } from "../server/return";

export async function getDB(
  name: string
): Promise<{ [key: string]: any } | undefined> {
  if (!DBs.has(name)) return undefined;

  const dbInfo = DBs.get(name) as DB;

  if (!existsSync(dbInfo.path)) {
    writeFile(dbInfo.path, "{}", { encoding: "utf-8" });

    return {};
  }

  const data = await readFile(dbInfo?.path, { encoding: "utf-8" });

  let json;

  try {
    json = JSON.parse(await data);
  } catch {
    json = undefined;
  }

  return json;
}

export async function setDB(name: string, data: object): Promise<boolean> {
  if (!DBs.has(name)) return false;

  const dI = DBs.get(name) as DB;

  try {
    await writeFile(dI?.path, JSON.stringify(data));

    return true;
  } catch {
    return false;
  }
}

export async function verifyDBs() {
  for (const path of DBs) {
    let exists = false;

    const db = await getDB(path[0]);

    if (!(await existsSync(path[1].path)) || !db) {
      exists = false;

      writeFile(path[1].path, "{}", { encoding: "utf-8" });
    } else exists = true;

    console.log(
      `${`[DB] [verifyFiles] Database file ${path[1].path}`.padEnd(50, " ")} ${
        exists ? "PRESENT" : "MISSING"
      }`
    );
  }
}

export async function CommitOk(
  source: string,
  res: ServerResponse,
  ...writes: { db: string; data: any }[]
) {
  for (let i = 0; i < writes.length; i++) {
    const db = writes[i].db;
    const data = writes[i].data;

    if (DBs.has(db)) {
      const written = await setDB(db, data);

      if (!written) {
        Ok(res, "", 304);

        return;
      }

      Ok(res, "", 200);
    }
  }
}
