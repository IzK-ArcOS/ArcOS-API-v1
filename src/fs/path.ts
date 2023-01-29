import { userExists } from "../auth/user";

import path from "path";
import { fsroot } from "../env/main";
import { existsSync } from "fs";

export async function getUserPath(username: string, ...scopedPaths: string[]) {
  if (!(await userExists(username))) return false;

  return path.join(fsroot, username, ...scopedPaths);
}

export async function userPathExists(
  username: string,
  ...scopedPaths: string[]
) {
  const dirPath = await getUserPath(username, ...scopedPaths);

  if (!dirPath) return false;

  return existsSync(dirPath);
}
