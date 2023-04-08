import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { ServerResponse } from "http";
import { DB, dbRoot, DBs } from "../env/main";
import { Error, Ok } from "../server/return";
import sleep from "../sleep";

const counters: { [key: string]: number } = {};
const dbCache: { [key: string]: any } = {};

export async function getDB(
  name: string
): Promise<{ [key: string]: any } | undefined> {
  if (!DBs.has(name)) return undefined;

  if (dbCache[name]) return dbCache[name];

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

  dbCache[name] = json;

  return json;
}

export async function setDB(name: string, data: object): Promise<boolean> {
  if (!DBs.has(name)) return false;

  if (!counters[name]) counters[name] = 0;

  if (dbCache[name]) {
    counters[name]++;

    dbCache[name] = data;

    if (counters[name] > 15 && Object.entries(data).length) {
      counters[name] = 0;

      const dI = DBs.get(name) as DB;

      try {
        await writeFile(
          `${dbRoot}/backups/${name}.old_${new Date().getTime()}`,
          await readFile(dI?.path),
          { encoding: "utf-8" }
        );

        await writeFile(dI?.path, JSON.stringify(data));

        await sleep(5);

        return true;
      } catch {
        return false;
      }
    }

    return true;
  }

  const dI = DBs.get(name) as DB;

  try {
    await writeFile(dI?.path, JSON.stringify(data));

    return true;
  } catch {
    return false;
  }
}

export async function verifyDBs() {
  try {
    await mkdir(`${dbRoot}/backups`);

    console.log("Created backup directory!");
  } catch {
    console.log(
      "warning: could not create backup directory. Does it exist already?"
    );
  }

  for (const path of DBs) {
    let exists = false;

    const db = await getDB(path[0]);

    if (!(await existsSync(path[1].path)) || !db) {
      exists = false;

      writeFile(path[1].path, "{}", { encoding: "utf-8" });
    } else exists = true;

    await getDB(path[0]);

    await writeFile(
      `${dbRoot}/backups/${path[0]}.initial_${new Date().getTime()}`,
      await readFile(path[1].path),
      { encoding: "utf-8" }
    );

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
