import { readdir, stat } from "fs/promises";
import { join } from "path/posix";
import { UserFile } from "./interface";
import { getUserPath } from "./path";
import mime from "mime-types";

export async function getTree(path: string): Promise<string[]> {
  let result = [];

  const contents = await readdir(path, { encoding: "utf-8" });

  for (let i = 0; i < contents.length; i++) {
    try {
      const item = contents[i];
      const itemPath = join(path, item);
      const itemStat = await stat(itemPath);

      if (itemStat.isDirectory()) {
        result.push(...(await getTree(itemPath)));
        continue;
      }

      result.push(itemPath);
    } catch {
      continue;
    }
  }

  return result;
}

export async function getUserTree(username: string) {
  const path = (await getUserPath(username, false)) as string;

  const files = await getTree(path);

  const result: UserFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const p = files[i].replace(path, ".");
    const parts = p.split("/");
    const filename = parts[parts.length - 1];

    result.push({
      mime: mime.contentType(filename) || "text/plain",
      scopedPath: p,
      filename,
    });
  }

  return result;
}
