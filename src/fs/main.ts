import { readdir, stat } from "fs/promises";
import { getUserPath, userPathExists } from "./path";
import path, { dirname } from "path";
import { PartialUserDir, UserDirectory, UserFile } from "./interface";
import mime from "mime-types";

export async function getUserDirectory(username: string, scopedPath: string) {
  let dirPath = await getUserPath(username, scopedPath);

  if (!dirPath || !userPathExists(username, scopedPath)) return false;

  const contents = await readdir(dirPath, { encoding: "utf-8" });

  let dirs: PartialUserDir[] = [];
  let files: UserFile[] = [];

  for (let i = 0; i < contents.length; i++) {
    const item = contents[i];
    const itemPath = path.join(dirPath, item);
    const scopedItemPath = path.join(scopedPath, item);

    if (!userPathExists(username, scopedPath, item)) continue;

    const fileStat = await stat(itemPath);

    const isFile = fileStat.isFile();
    const isDir = fileStat.isDirectory();
    const fileSize = fileStat.size;

    if (isFile)
      files.push({
        filename: item,
        scopedPath: scopedItemPath,
        size: fileSize,
        mime: mime.contentType(item) || "unknown",
      });

    if (isDir)
      dirs.push({
        name: item,
        scopedPath: scopedItemPath,
      });
  }

  const dir: UserDirectory = {
    files,
    directories: dirs,
    name: dirname(dirPath),
    scopedPath,
  };

  return dir;
}
