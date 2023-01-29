import { mkdir } from "fs/promises";
import path from "path";
import { getDB } from "../db/main";
import { fsroot } from "../env/main";
import { joinPath, userPathExists } from "./path";

export async function verifyUserDirectories() {
  console.log(
    `VerifyUserDirectories: verifying user directories for all users...`
  );
  const users = Object.keys((await getDB("pref")) as { [key: string]: string });

  if (!users || !users.length) return false;

  for (let i = 0; i < users.length; i++) {
    if (await userPathExists(users[i])) {
      console.log(`VerifyUserDirectories: ${users[i]} has a user directory.`);

      continue;
    }

    console.log(
      `VerifyUserDirectories: ${users[i]} has no user directory, creating.`
    );

    try {
      mkdir(joinPath(fsroot, users[i]));
    } catch (e) {
      console.log(
        `VerifyUserDirectories: Couldn't create user directory for ${users[i]}: ${e}`
      );
    }
  }

  return true;
}
