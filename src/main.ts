import { loadConfig } from "./config/main";
import { CONFIG, DEFAULT_CONFIG } from "./config/store";
import { setRoots } from "./env/main";
import { ArcEval } from "./server/endpoint/store";
import { makeServer } from "./server/main";

(async () => {
  await loadConfig();

  const paths = CONFIG.paths || DEFAULT_CONFIG.paths;

  await setRoots(
    paths.fs as string,
    paths.db as string,
    paths.template as string
  );

  setTimeout(() => {
    makeServer(CONFIG.port as number, CONFIG.name as string, ArcEval);
  }, 100);
})();

process.on("uncaughtException", function (err) {
  console.error(err);
});
