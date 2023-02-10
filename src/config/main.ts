import { readFile, writeFile } from "fs/promises";
import { Configuration } from "./interface";
import { DEFAULT_CONFIG, setConfig } from "./store";

export async function loadConfig() {
  try {
    const file = await readFile("./config.json", { encoding: "utf-8" });

    const config = (await JSON.parse(file)) as Configuration;

    await setConfig(config);
  } catch {
    console.log("loadConfig: unable to parse config, writing defaults");

    await writeFile("./config.json", JSON.stringify(DEFAULT_CONFIG), {
      encoding: "utf-8",
    });

    await setConfig(DEFAULT_CONFIG);
  }
}
