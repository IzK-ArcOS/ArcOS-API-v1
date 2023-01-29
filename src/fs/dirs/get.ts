import { readdir, stat } from "fs/promises";
import mime from "mime-types";
import { PartialUserDir, UserDirectory, UserFile } from "../interface";
import { getUserPath, joinPath, userPathExists } from "../path";

export async function getUserDirectory(username: string, scopedPath: string) {
  let dirPath = await getUserPath(username, false, scopedPath);

  if (
    !dirPath ||
    scopedPath.includes("..") ||
    !(await userPathExists(username, scopedPath))
  )
    return false;

  const contents = await readdir(dirPath, { encoding: "utf-8" });

  let dirs: PartialUserDir[] = [];
  let files: UserFile[] = [];

  for (let i = 0; i < contents.length; i++) {
    const item = contents[i];
    const itemPath = joinPath(dirPath, item);
    const scopedItemPath = joinPath(scopedPath, item);

    if (!(await userPathExists(username, scopedPath, item))) continue;

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

  const fullPathSplit = dirPath.split("/");

  const name = fullPathSplit[fullPathSplit.length - 1];

  const dir: UserDirectory = {
    files,
    directories: dirs,
    name,
    scopedPath: scopedPath,
  };

  return dir;
}
