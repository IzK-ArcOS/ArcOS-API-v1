import { mkdir } from "fs/promises";
import { getUserPath, userPathExists } from "../path";

export async function createUserDirectory(
  username: string,
  scopedPath: string
) {
  let dirPath = await getUserPath(username, scopedPath);

  if (!dirPath || (await userPathExists(username, scopedPath))) return false;

  try {
    await mkdir(dirPath);

    return true;
  } catch {
    return false;
  }
}
