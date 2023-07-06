import { setMaxQuota } from "../fs/quota/main";
import { Configuration, FlexibleConfiguration } from "./interface";

export let CONFIG: FlexibleConfiguration = {};

export const DEFAULT_CONFIG: Configuration = {
  port: 3333,
  name: "ArcAPI",
  paths: {
    fs: "./fs",
    db: "./db",
    template: "./template",
  },
  maxFSSize: 2 * 1024 * 1024 * 1024,
  authCode: "",
  noCaching: false,
  lockThrottle: 10,
};

export function setConfig(config: Configuration) {
  if (typeof config.lockThrottle === "number" && config.lockThrottle <= 9) {
    console.log(
      "[SERVER] Aborting: the lockThrottle must be above or equal to 10."
    );

    process.exit(1);
  }
  CONFIG = config;

  setMaxQuota(config?.maxFSSize);
}
