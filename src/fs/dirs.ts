import { mkdir } from "fs/promises";
import { getDB } from "../db/main";
import { fsroot } from "../env/main";
import { joinPath, userPathExists } from "./path";

export async function verifyUserDirectories() {
  console.log(`[FS] [verifyUserDirectories] Now verifying user directories...`);
  const users = Object.keys((await getDB("pref")) as { [key: string]: string });

  if (!users || !users.length) return false;

  for (let i = 0; i < users.length; i++) {
    if (await userPathExists(users[i])) {
      console.log(`[FS] [verifyUserDirectories] [${i}] Directory present.`);

      continue;
    }

    console.log(
      `[FS] [verifyUserDirectories] [${i}] No directory, creating "${joinPath(
        fsroot,
        users[i]
      )}".`
    );
    try {
      mkdir(joinPath(fsroot, users[i]));
    } catch (e) {
      console.log(
        `[FS] [verifyUserDirectories] [${i}] Unable to create user directory.`
      );
    }
  }

  return true;
}
