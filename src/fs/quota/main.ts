import { readdir, stat } from "fs/promises";
import { join } from "path";
import { userExists } from "../../auth/user";
import { getUserPath } from "../path";

export let MAX_QUOTA = 2 * 1024 * 1024 * 1024;

export function setMaxQuota(num: number) {
  MAX_QUOTA = num;
}

export async function getFreeSpace(username: string) {
  if (!(await userExists(username))) return 0;

  const userPath = await getUserPath(username, false);

  if (!userPath) return 0;

  const size = await getUserDirectorySize(username);

  return MAX_QUOTA - size;
}

export async function getUsedSpace(username: string) {
  if (!(await userExists(username))) return 0;

  const userPath = await getUserPath(username, false);

  if (!userPath) return 0;

  const size = await getUserDirectorySize(username);

  return size;
}

export async function checkSpaceRequirement(username: string, size: number) {
  const freeSpace = await getFreeSpace(username);

  if (!freeSpace) return false;

  return freeSpace - size >= 0;
}

export async function getUserDirectorySize(username: string) {
  if (!(await userExists(username))) return 0;

  const userPath = await getUserPath(username, false);

  if (!userPath) return 0;

  return await getTotalFileSize(userPath);
}

export async function getTotalFileSize(path: string) {
  let total = 0;

  const contents = await readdir(path, { encoding: "utf-8" });

  for (let i = 0; i < contents.length; i++) {
    try {
      const item = contents[i];
      const itemPath = join(path, item);
      const itemStat = await stat(itemPath);

      if (itemStat.isDirectory()) {
        total += await getTotalFileSize(itemPath);
        continue;
      }

      total += itemStat.size;
    } catch {
      continue;
    }
  }

  return total;
}
