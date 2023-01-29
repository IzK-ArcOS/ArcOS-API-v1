import { userExists } from "../auth/user";

import path from "path";
import { fsroot } from "../env/main";
import { existsSync } from "fs";

export function joinPath(...items: string[]) {
  return path.posix.join(...items);
}

export async function getUserPath(username: string, ...scopedPaths: string[]) {
  if (!(await userExists(username)) || scopedPaths.includes("..")) return false;

  return joinPath(fsroot, username, ...scopedPaths);
}

export async function userPathExists(
  username: string,
  ...scopedPaths: string[]
) {
  const dirPath = await getUserPath(username, ...scopedPaths);

  if (!dirPath) return false;

  return existsSync(dirPath);
}
