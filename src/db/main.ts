import { DB, dbRoot, DBs } from "../env/main";
import { readFile, rm, stat, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { createErrorRes, writeToRes } from "../server/return";

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
      `${`DB: verifyFiles: Database file ${path[1].path} (${path[1].name})`.padEnd(
        70,
        " "
      )} ${exists ? "[PRESENT]" : "[MISSING]"}`
    );
  }
}

export async function commitChanges(
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
        res.statusCode = 304;

        writeToRes(
          res,
          createErrorRes(
            "Write failed",
            `Cannot ${source}: database change did not process.`,
            false
          )
        );

        return;
      }

      writeToRes(
        res,
        createErrorRes(
          "Write completed",
          `Endpoint '${source}' completed successfully.`,
          true
        )
      );
    }
  }
}
