import { userExists } from "../auth/user";

import path from "path";
import { fsroot } from "../env/main";
import { existsSync } from "fs";

export function joinPath(...items: string[]) {
  return path.posix.join(...items);
}

export async function getUserPath(
  username: string,
  noexist: boolean,
  ...scopedPaths: string[]
) {
  if (!(await userExists(username))) return false;

  for (let i = 0; i < scopedPaths.length; i++) {
    if (scopedPaths[i].includes("..")) return false;
  }

  const p = joinPath(fsroot, username, ...scopedPaths);

  if (noexist) return p;

  if (!existsSync(p)) return false;

  return p;
}

export async function userPathExists(
  username: string,
  ...scopedPaths: string[]
) {
  const dirPath = await getUserPath(username, false, ...scopedPaths);

  if (!dirPath) return false;

  return existsSync(dirPath);
}
