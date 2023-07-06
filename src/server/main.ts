import http, { IncomingMessage, ServerResponse } from "http";
import { verifyDBs } from "../db/main";
import { verifyUserDirectories } from "../fs/dirs";
import { Lock, waitForLock } from "../lock";
import sleep from "../sleep";
import { checkAuthcode } from "./authcode";
import { Endpoint } from "./endpoint/main";
import { serverListener } from "./listen";
import { Error, Ok } from "./return";
import { CONFIG } from "../config/store";

export const reqLock = new Lock();

export async function makeServer(
  port: number,
  name: string,
  evaluator: Map<string, Endpoint>
) {
  console.log(`[SERVER] Starting API ${name} on localhost:${port}`);

  await verifyDBs();
  await verifyUserDirectories();

  const server = http.createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      res.setHeader("content-type", "application/json");

      await waitForLock(reqLock);

      if (!checkAuthcode(req)) {
        return Ok(
          res,
          Error(
            "Can't process request",
            "This is a private API that requires valid AuthCode authentication to be provided with the request.",
            false
          ),
          403
        );
      }

      reqLock.set(true);

      await serverListener(req, res, evaluator);
      await sleep(CONFIG.lockThrottle || 10);

      reqLock.set(false);
    }
  );

  server.listen(port);
}
