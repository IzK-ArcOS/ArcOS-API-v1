import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { CONFIG } from "../../config/store";
import { Ok } from "../../server/return";

export async function ArcOSConnect(req: IncomingMessage, res: ServerResponse) {
  console.log(url.parse(req.url as string, true));
  Ok(
    res,
    JSON.stringify({
      platform: `ArcOS @ ${CONFIG.name}`,
      port: CONFIG.port,
      referrer: url.parse(req.url as string).pathname,
      valid: true,
    })
  );
}
