import { lstat, mkdir, readdir, readFile, writeFile } from "fs/promises";
import { CONFIG, DEFAULT_CONFIG } from "../../config/store";
import { getUserPath } from "../path";

export async function deployTemplate(username: string) {
  const directory = (await getUserPath(username, false)) as string;
  const templateDir = CONFIG.paths?.template || DEFAULT_CONFIG.paths.template;

  await copyDirectory(templateDir, directory);
}

export async function copyDirectory(src: string, dest: string) {
  const files = await readdir(src);

  try {
    await mkdir(dest, { recursive: true });
  } catch {
    /** */
  }

  for (const file of files) {
    const srcPath = `${src}/${file}`;
    const destPath = `${dest}/${file}`;
    const stat = await lstat(srcPath);

    if (stat.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      const contents = await readFile(srcPath);
      await writeFile(destPath, contents);
    }
  }
}
