import { setMaxQuota } from "../fs/quota/main";
import { Configuration, FlexibleConfiguration } from "./interface";

export let CONFIG: FlexibleConfiguration = {};

export const DEFAULT_CONFIG: Configuration = {
  port: 3333,
  name: "ArcAPI",
  paths: {
    fs: "./fs",
    db: "./db",
  },
  maxFSSize: 2 * 1024 * 1024 * 1024,
};

export function setConfig(config: Configuration) {
  CONFIG = config;

  setMaxQuota(config?.maxFSSize);
}
