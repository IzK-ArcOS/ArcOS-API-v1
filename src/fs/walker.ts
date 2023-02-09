import { readdir, stat } from "fs/promises";
import { join } from "path";

export async function walkDirectory(path: string): Promise<string[]> {
  let result = [];

  const files = await readdir(path);

  for (let i = 0; i < files.length; i++) {
    const Absolute = join(path, files[i]);

    const stats = await stat(Absolute);

    if (stats.isDirectory()) {
      result.push(...(await walkDirectory(Absolute)));

      continue;
    }

    result.push(Absolute);
  }

  return result;
}
